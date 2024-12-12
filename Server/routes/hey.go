package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func RegisterHeyRoute(router *gin.Engine) {
	router.GET("/hey", services.HeyHandler)
}
