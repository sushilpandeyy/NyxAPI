package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"NyxAPI/config"
	"NyxAPI/models"
	"NyxAPI/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type App struct {
	DB     *gorm.DB
	Router *gin.Engine
	server *http.Server
	logger *slog.Logger
}

// NewApp initializes the application with database, router, and logger.
func NewApp() (*App, error) {
	// Structured logging setup
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	// Set Gin mode based on the environment
	env := os.Getenv("GIN_MODE")
	switch env {
	case "release":
		gin.SetMode(gin.ReleaseMode)
	case "test":
		gin.SetMode(gin.TestMode)
	default:
		gin.SetMode(gin.DebugMode)
		logger.Info("Defaulting to debug mode")
	}

	// Connect to the database
	db, err := config.ConnectToDB()
	if err != nil {
		logger.Error("Database connection failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure database and auto-migrate models
	models.SetDB(db)
	if err := db.AutoMigrate(&models.User{}, &models.Project{}, &models.Usage{}, &models.Endpoint{}); err != nil {
		logger.Error("Database migration failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("database migration failed: %w", err)
	}

	// Setup Gin router
	router := gin.New()
	router.Use(
		gin.LoggerWithConfig(gin.LoggerConfig{
			SkipPaths: []string{"/health"},
		}),
		gin.Recovery(),
		cors.Default(), // Default CORS policy
	)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
		})
	})

	// Initialize routes
	routes.UserRoute(router)

	return &App{
		DB:     db,
		Router: router,
		logger: logger,
	}, nil
}

// Start starts the HTTP server
func (a *App) Start(addr string) error {
	a.server = &http.Server{
		Addr:         addr,
		Handler:      a.Router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	a.logger.Info("Starting server", slog.String("address", addr))
	if err := a.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("server startup error: %w", err)
	}
	return nil
}

// Shutdown performs graceful shutdown of the application
func (a *App) Shutdown(ctx context.Context) error {
	var errs []error

	// Shutdown HTTP server
	if a.server != nil {
		if err := a.server.Shutdown(ctx); err != nil {
			errs = append(errs, fmt.Errorf("server shutdown error: %w", err))
		}
	}

	// Close database connection
	if a.DB != nil {
		sqlDB, err := a.DB.DB()
		if err != nil {
			errs = append(errs, fmt.Errorf("failed to get database connection: %w", err))
		} else if err := sqlDB.Close(); err != nil {
			errs = append(errs, fmt.Errorf("database close error: %w", err))
		}
	}

	// Log and return any shutdown errors
	if len(errs) > 0 {
		a.logger.Error("Shutdown encountered errors", slog.Any("errors", errs))
		return fmt.Errorf("shutdown errors: %v", errs)
	}

	a.logger.Info("Server gracefully stopped")
	return nil
}

func main() {
	// Handle OS signals for graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Initialize application
	app, err := NewApp()
	if err != nil {
		slog.New(slog.NewJSONHandler(os.Stderr, nil)).Error("Application initialization failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	// Start server in a goroutine
	go func() {
		if err := app.Start(":8080"); err != nil {
			app.logger.Error("Server startup failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	// Wait for termination signal
	<-ctx.Done()
	app.logger.Info("Shutdown signal received")

	// Perform graceful shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.Shutdown(shutdownCtx); err != nil {
		app.logger.Error("Graceful shutdown failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
