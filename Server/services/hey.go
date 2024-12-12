package services

import (
	"github.com/gin-gonic/gin"
)

func HeyHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello!",
	})
}
