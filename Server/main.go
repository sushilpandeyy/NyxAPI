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

func NewApp() (*App, error) {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

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

	db, err := config.ConnectToDB()
	if err != nil {
		logger.Error("Database connection failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	models.SetDB(db)
	if err := db.AutoMigrate(&models.User{}, &models.Project{}, &models.Usage{}, &models.Endpoint{}); err != nil {
		logger.Error("Database migration failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("database migration failed: %w", err)
	}

	router := gin.New()
	router.Use(
		gin.LoggerWithConfig(gin.LoggerConfig{
			SkipPaths: []string{"/health"},
		}),
		gin.Recovery(),
		cors.New(cors.Config{
			AllowAllOrigins: true,
			AllowMethods:    []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:    []string{"*"},
		}),
	)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
		})
	})

	routes.UserRoute(router)
	routes.ProjectRoute(router)
	routes.Endpointroutes(router)

	return &App{
		DB:     db,
		Router: router,
		logger: logger,
	}, nil
}

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

func (a *App) Shutdown(ctx context.Context) error {
	var errs []error

	if a.server != nil {
		if err := a.server.Shutdown(ctx); err != nil {
			errs = append(errs, fmt.Errorf("server shutdown error: %w", err))
		}
	}

	if a.DB != nil {
		sqlDB, err := a.DB.DB()
		if err != nil {
			errs = append(errs, fmt.Errorf("failed to get database connection: %w", err))
		} else if err := sqlDB.Close(); err != nil {
			errs = append(errs, fmt.Errorf("database close error: %w", err))
		}
	}

	if len(errs) > 0 {
		a.logger.Error("Shutdown encountered errors", slog.Any("errors", errs))
		return fmt.Errorf("shutdown errors: %v", errs)
	}

	a.logger.Info("Server gracefully stopped")
	return nil
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	app, err := NewApp()
	if err != nil {
		slog.New(slog.NewJSONHandler(os.Stderr, nil)).Error("Application initialization failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	go func() {
		if err := app.Start(":8080"); err != nil {
			app.logger.Error("Server startup failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	app.logger.Info("Shutdown signal received")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.Shutdown(shutdownCtx); err != nil {
		app.logger.Error("Graceful shutdown failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
