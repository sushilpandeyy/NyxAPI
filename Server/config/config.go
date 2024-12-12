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

// DatabaseConfig holds the database configuration
type DatabaseConfig struct {
	User     string
	Password string
	Host     string
	Name     string
	SSLMode  string
}

// DB holds the database connection
var (
	db   *gorm.DB
	once sync.Once
)

// ConnectToDB establishes a connection to the PostgreSQL database using GORM
func ConnectToDB() (*gorm.DB, error) {
	var connectionError error

	once.Do(func() {
		// Retrieve the environment variables for PostgreSQL connection
		config := DatabaseConfig{
			User:     "neondb_owner",
			Password: "sZ2uNCIlE8MA",
			Host:     "ep-royal-art-a1o7c6ko.ap-southeast-1.aws.neon.tech",
			Name:     "neondb",
			SSLMode:  "require",
		}

		// Validate required configuration
		if connectionError = validateConfig(config); connectionError != nil {
			return
		}

		// Construct the connection string
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=%s",
			config.Host, config.User, config.Password, config.Name, config.SSLMode)

		// Configure GORM logger
		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,   // Slow SQL threshold
				LogLevel:                  logger.Silent, // Log level
				IgnoreRecordNotFoundError: true,          // Ignore ErrRecordNotFound error for logger
				Colorful:                  false,         // Disable color
			},
		)

		// Open the database connection with GORM
		db, connectionError = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if connectionError != nil {
			return
		}

		// Get the underlying SQL database and configure connection pool
		sqlDB, err := db.DB()
		if err != nil {
			connectionError = fmt.Errorf("failed to get SQL database: %w", err)
			return
		}

		// Configure connection pool
		sqlDB.SetMaxOpenConns(25)
		sqlDB.SetMaxIdleConns(25)
		sqlDB.SetConnMaxLifetime(5 * time.Minute)

		// Ping the database to verify the connection
		if connectionError = sqlDB.Ping(); connectionError != nil {
			return
		}

		// Optionally, fetch the PostgreSQL version to confirm connection
		var version string
		if connectionError = db.Raw("SELECT version()").Scan(&version).Error; connectionError != nil {
			return
		}

		log.Printf("Connected to PostgreSQL! Version: %s\n", version)
	})

	if connectionError != nil {
		return nil, connectionError
	}

	return db, nil
}

// validateConfig checks if all required database configuration fields are present
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
