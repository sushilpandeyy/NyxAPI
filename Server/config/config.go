package config

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DatabaseConfig holds the database connection parameters
type DatabaseConfig struct {
	User     string
	Password string
	Host     string
	Name     string
	SSLMode  string
}

// Singleton instance for database connection
var (
	db   *gorm.DB
	once sync.Once
)

// ConnectToDB initializes and returns a database connection
func ConnectToDB() (*gorm.DB, error) {
	var connectionError error

	once.Do(func() {
		// Define database connection configuration
		config := DatabaseConfig{}

		// Validate configuration
		if err := validateConfig(config); err != nil {
			connectionError = err
			return
		}

		// Create DSN (Data Source Name) string
		dsn := fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s sslmode=%s",
			config.Host, config.User, config.Password, config.Name, config.SSLMode,
		)

		// Configure logger for GORM
		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,   // Slow SQL threshold
				LogLevel:                  logger.Silent, // Log level
				IgnoreRecordNotFoundError: true,          // Ignore "record not found" error
				Colorful:                  false,         // Disable color
			},
		)

		// Open database connection
		db, connectionError = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if connectionError != nil {
			return
		}

		// Configure SQL database settings
		sqlDB, err := db.DB()
		if err != nil {
			connectionError = fmt.Errorf("failed to get SQL database: %w", err)
			return
		}

		sqlDB.SetMaxOpenConns(25)
		sqlDB.SetMaxIdleConns(25)
		sqlDB.SetConnMaxLifetime(5 * time.Minute)

		// Test database connection
		if err := sqlDB.Ping(); err != nil {
			connectionError = fmt.Errorf("failed to ping database: %w", err)
			return
		}

		log.Println("Successfully connected to the database!")
	})

	// Return error if connection failed
	if connectionError != nil {
		return nil, connectionError
	}

	return db, nil
}

// validateConfig checks if all database configuration parameters are set
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

// CloseDB closes the database connection
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
