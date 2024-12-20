package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func Shareendpoints(router *gin.Engine) {
	router.GET("/share/all/:projid", services.Getshared)
	router.GET("/share/:userinit", services.Nameemailsrecommend)
	router.PUT("/share/:projid/:email", services.Addemail)
	router.DELETE("/share/:projid/:email", services.RemoveEmail)
	router.GET("/share/get/:usermail", services.GetSharedProj)
}
