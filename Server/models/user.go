package models

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Name  string `gorm:"type:varchar(100);not null"`
	Email string `gorm:"type:varchar(100);unique_index;not null"`
}
