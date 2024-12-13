package main

import (
	"context"
	"log"
	"net/http"
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
}

func NewApp() (*App, error) {
	gin.SetMode(gin.ReleaseMode)

	db, err := config.ConnectToDB()
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&models.User{}, &models.Project{}, &models.Usage{}, &models.Endpoint{}); err != nil {
		return nil, err
	}

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors.Default())
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	routes.RegisterHeyRoute(router)

	return &App{DB: db, Router: router}, nil
}

func (a *App) start(addr string) *http.Server {
	srv := &http.Server{
		Addr:         addr,
		Handler:      a.Router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("Starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server startup error: %v", err)
		}
	}()

	return srv
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(),
		syscall.SIGINT,
		syscall.SIGTERM,
	)
	defer stop()

	app, err := NewApp()
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	srv := app.start(":8080")

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}

	if err := config.CloseDB(); err != nil {
		log.Printf("Database close error: %v", err)
	}

	log.Println("Server gracefully stopped")
}
