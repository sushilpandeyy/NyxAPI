package models

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Name          string `gorm:"type:varchar(100);not null"`
	Email         string `gorm:"type:varchar(100);unique_index;not null"`
	EmailVerified bool   `gorm:"type:boolean;default:false"`
	Type          string `gorm:"type:varchar(100);default:'classic'"`
	Password      string `gorm:"type:varchar(100);"`
}
