package models

import "gorm.io/gorm"

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
	UserID      uint       `gorm:"not null"`                                       // Foreign key referencing User
	User        User       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Relationship to User
	Description string     `gorm:"type:text"`
	Img         string     `gorm:"type:varchar(255)"`
	Shared      []uint     `gorm:"type:integer[]"` // Represents ARRAY(Integer)
	Endpoints   []Endpoint `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Endpoint struct {
	gorm.Model
	ID        uint     `gorm:"primaryKey;autoIncrement"`
	Endpoint  string   `gorm:"type:varchar(255);not null"`
	ProjectID uint     `gorm:"not null"`                                       // Foreign key referencing Project
	Project   Project  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Relationship to Project
	Working   bool     `gorm:"type:boolean;default:true"`
	Locked    *int     `gorm:"type:integer"` // Nullable field
	APIType   []string `gorm:"type:text[]"`  // Represents ARRAY(String)
	Payload   string   `gorm:"type:text"`
}

type Usage struct {
	gorm.Model
	ID        uint `gorm:"primaryKey;autoIncrement"`
	UserID    uint `gorm:"not null"` // Foreign key referencing User
	Project   uint `gorm:"not null"` // Referencing Project by ID
	Endpoints uint `gorm:"not null"`
}
