package models

import (
	"fmt"

	"gorm.io/gorm"
)

var db *gorm.DB

func SetDB(database *gorm.DB) {
	if database == nil {
		panic("Cannot set a nil database instance")
	}
	db = database
	fmt.Println("Database instance successfully set")
}

func GetDB() *gorm.DB {
	if db == nil {
		panic("Database instance is not initialized. Call SetDB() during initialization")
	}
	return db
}

type User struct {
	gorm.Model
	ID            uint      `gorm:"primaryKey;autoIncrement"`
	Name          string    `gorm:"type:varchar(100);not null"`
	Email         string    `gorm:"type:varchar(100);unique;not null"`
	Password      string    `gorm:"type:varchar(100);not null"`
	EmailVerified bool      `gorm:"type:boolean;default:false"`
	AccountType   string    `gorm:"type:varchar(50);default:'Basic'"`
	Projects      []Project `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Project struct {
	gorm.Model
	ID          uint       `gorm:"primaryKey;autoIncrement"`
	ProjectID   uint       `gorm:"unique;not null"`
	Title       string     `gorm:"type:varchar(255);not null"`
	UserID      uint       `gorm:"not null"`
	User        User       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Description string     `gorm:"type:text"`
	Img         string     `gorm:"type:varchar(255)"`
	Shared      []uint     `gorm:"type:integer[]"`
	Endpoints   []Endpoint `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Endpoint struct {
	gorm.Model
	ID        uint     `gorm:"primaryKey;autoIncrement"`
	Endpoint  string   `gorm:"type:varchar(255);not null"`
	ProjectID uint     `gorm:"not null"`
	Project   Project  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Working   bool     `gorm:"type:boolean;default:true"`
	Locked    *int     `gorm:"type:integer"`
	APIType   []string `gorm:"type:text[]"`
	Payload   string   `gorm:"type:text"`
}

type Usage struct {
	gorm.Model
	ID        uint `gorm:"primaryKey;autoIncrement"`
	UserID    uint `gorm:"not null"`
	Project   uint `gorm:"not null"`
	Endpoints uint `gorm:"not null"`
}
