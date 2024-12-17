package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func Shareendpoints(router *gin.Engine) {
	router.GET("/share/:userinit", services.Nameemailsrecommend)
	router.PUT("/share/:projid/:email", services.Addemail)
}
