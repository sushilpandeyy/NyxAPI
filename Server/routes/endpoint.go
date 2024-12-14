package routes

import (
	"NyxAPI/services"

	"github.com/gin-gonic/gin"
)

func Endpointroutes(router *gin.Engine) {
	router.GET("/endpoint/:projectid", services.Getallendpoint)
	router.GET("/endpoint/get/:EndpointID", services.Infoaboutpayload)
	router.POST("/endpoint/create", services.Createendpoint)
	router.PUT("/endpoint/updatepayload/:EndpointID", services.UpdatePayload)
	router.PUT("/endpoint/updateapitype/:endpointID", services.UpdateAPIType)
	router.PUT("/endpoint/updateschema/:endpointID", services.UpdateEndpointScheme)
	router.PUT("/endpoint/working/:endpointID", services.UpdateWorking)
}
