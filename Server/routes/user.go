package routes

import (
	userservice "NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {
	router.GET("/hey", userservice.HeyHandler)
	router.POST("/users", userservice.CreateUserHandler)
}
