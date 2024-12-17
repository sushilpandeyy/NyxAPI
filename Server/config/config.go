package config

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabaseConfig struct {
	User     string
	Password string
	Host     string
	Name     string
	SSLMode  string
}

var (
	db   *gorm.DB
	once sync.Once
)

func loadConfig() (DatabaseConfig, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		return DatabaseConfig{}, fmt.Errorf("error loading .env file: %w", err)
	}

	return DatabaseConfig{
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Host:     os.Getenv("DB_HOST"),
		Name:     os.Getenv("DB_NAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}, nil
}

func ConnectToDB() (*gorm.DB, error) {
	var connectionError error

	once.Do(func() {
		config, err := loadConfig()
		if err != nil {
			connectionError = err
			return
		}

		if err := validateConfig(config); err != nil {
			connectionError = err
			return
		}

		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s sslmode=%s",
			config.Host, config.User, config.Password, config.Name, config.SSLMode,
		)

		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  logger.Silent,
				IgnoreRecordNotFoundError: true,
				Colorful:                  false,
			},
		)

		db, connectionError = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if connectionError != nil {
			return
		}

		sqlDB, err := db.DB()
		if err != nil {
			connectionError = fmt.Errorf("failed to get SQL database: %w", err)
			return
		}

		sqlDB.SetMaxOpenConns(25)
		sqlDB.SetMaxIdleConns(25)
		sqlDB.SetConnMaxLifetime(5 * time.Minute)

		if err := sqlDB.Ping(); err != nil {
			connectionError = fmt.Errorf("failed to ping database: %w", err)
			return
		}

		log.Println("Successfully connected to the database!")
	})

	if connectionError != nil {
		return nil, connectionError
	}

	return db, nil
}

func validateConfig(config DatabaseConfig) error {
	if config.User == "" {
		return fmt.Errorf("DB_USER is not set")
	}
	if config.Password == "" {
		return fmt.Errorf("DB_PASSWORD is not set")
	}
	if config.Host == "" {
		return fmt.Errorf("DB_HOST is not set")
	}
	if config.Name == "" {
		return fmt.Errorf("DB_NAME is not set")
	}
	if config.SSLMode == "" {
		return fmt.Errorf("DB_SSLMODE is not set")
	}
	return nil
}

func CloseDB() error {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}
