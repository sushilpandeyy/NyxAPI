package services

import (
	"NyxAPI/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Getallendpoint(c *gin.Context) {
	Projectid := c.Param("projectid")

	db := models.GetDB()
	var endpoints []models.Endpoint

	if err := db.Where("project_id = ?", Projectid).Find(&endpoints).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No endpoints found for the given project"})
			return
		}
		log.Printf("Error fetching endpoints for project %s: %v", Projectid, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	for i := range endpoints {
		endpoints[i].Payload = decodePayload(endpoints[i].Payload)
	}

	c.JSON(http.StatusOK, endpoints)
}

func Createendpoint(c *gin.Context) {
	var endpointInput struct {
		Endpoint  string   `json:"endpoint" binding:"omitempty"`
		ProjectID uint     `json:"projectId" binding:"required"`
		Working   bool     `json:"working"`
		Locked    int      `json:"locked"`
		APIType   []string `json:"apiType"`
		Payload   string   `json:"payload"`
	}

	if err := c.ShouldBindJSON(&endpointInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := models.GetDB()

	var existingEndpoint models.Endpoint
	if err := db.Where("endpoint = ? AND project_id = ?", endpointInput.Endpoint, endpointInput.ProjectID).First(&existingEndpoint).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Duplicate endpoint for the given project"})
		return
	} else if err != nil && err != gorm.ErrRecordNotFound {
		// Handle any other errors
		log.Printf("Error checking duplicate endpoint: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	encodedPayload := encodePayload(endpointInput.Payload)

	newEndpoint := models.Endpoint{
		Endpoint:  endpointInput.Endpoint,
		ProjectID: endpointInput.ProjectID,
		Working:   endpointInput.Working,
		Locked:    &endpointInput.Locked,
		APIType:   endpointInput.APIType,
		Payload:   encodedPayload,
	}

	if err := db.Create(&newEndpoint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create endpoint",
			"cause": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Endpoint created successfully",
		"endpoint": gin.H{
			"id":        newEndpoint.ID,
			"endpoint":  newEndpoint.Endpoint,
			"projectId": newEndpoint.ProjectID,
			"working":   newEndpoint.Working,
			"locked":    newEndpoint.Locked,
			"apiType":   newEndpoint.APIType,
			"payload":   decodePayload(newEndpoint.Payload),
		},
	})
}
