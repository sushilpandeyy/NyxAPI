package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {
	router.GET("/hey", services.HeyHandler)
	router.POST("/users/register", services.CreateUserHandler)
	router.POST("/users/login", services.GetUser)
}
