package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func Endpointroutes(router *gin.Engine) {
	router.GET("/endpoint/:projectid", services.Getallendpoint)
	router.POST("/endpoint/create", services.Createendpoint)
}
