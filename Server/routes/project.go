package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func ProjectRoute(router *gin.Engine) {
	router.POST("/project/create", services.CreateProjectHandler)
}
