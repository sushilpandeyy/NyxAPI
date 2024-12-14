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

// App structure holds the database, router, server, and logger instances
type App struct {
	DB     *gorm.DB
	Router *gin.Engine
	server *http.Server
	logger *slog.Logger
}

// NewApp initializes the application components such as the database and routes
func NewApp() (*App, error) {
	// Initialize logger
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	// Set Gin mode based on environment
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

	// Set the global DB instance and migrate models
	models.SetDB(db)
	if err := db.AutoMigrate(&models.User{}, &models.Project{}, &models.Usage{}, &models.Endpoint{}); err != nil {
		logger.Error("Database migration failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("database migration failed: %w", err)
	}

	// Initialize Gin router and middlewares
	router := gin.New()
	router.Use(
		gin.LoggerWithConfig(gin.LoggerConfig{
			SkipPaths: []string{"/health"},
		}),
		gin.Recovery(),
		cors.Default(),
	)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
		})
	})

	// Register application routes
	routes.UserRoute(router)
	routes.ProjectRoute(router)
	routes.Endpointroutes(router)

	return &App{
		DB:     db,
		Router: router,
		logger: logger,
	}, nil
}

// Start launches the HTTP server
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

// Shutdown gracefully shuts down the application
func (a *App) Shutdown(ctx context.Context) error {
	var errs []error

	// Shutdown the HTTP server
	if a.server != nil {
		if err := a.server.Shutdown(ctx); err != nil {
			errs = append(errs, fmt.Errorf("server shutdown error: %w", err))
		}
	}

	// Close the database connection
	if a.DB != nil {
		sqlDB, err := a.DB.DB()
		if err != nil {
			errs = append(errs, fmt.Errorf("failed to get database connection: %w", err))
		} else if err := sqlDB.Close(); err != nil {
			errs = append(errs, fmt.Errorf("database close error: %w", err))
		}
	}

	// Log errors if shutdown is not clean
	if len(errs) > 0 {
		a.logger.Error("Shutdown encountered errors", slog.Any("errors", errs))
		return fmt.Errorf("shutdown errors: %v", errs)
	}

	a.logger.Info("Server gracefully stopped")
	return nil
}

func main() {
	// Create a context for handling OS signals
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Initialize the application
	app, err := NewApp()
	if err != nil {
		slog.New(slog.NewJSONHandler(os.Stderr, nil)).Error("Application initialization failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	// Start the server in a separate goroutine
	go func() {
		if err := app.Start(":8080"); err != nil {
			app.logger.Error("Server startup failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	// Wait for a termination signal
	<-ctx.Done()
	app.logger.Info("Shutdown signal received")

	// Perform a graceful shutdown with a timeout
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.Shutdown(shutdownCtx); err != nil {
		app.logger.Error("Graceful shutdown failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
