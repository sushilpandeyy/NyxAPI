package services

import (
	"NyxAPI/models"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
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

func UpdatePayload(c *gin.Context) {
	Endpointid := c.Param("EndpointID")

	var payloadInput struct {
		Endpoint string `json:"endpoint" binding:"omitempty"`
		Payload  string `json:"payload"`
	}
	if err := c.ShouldBindJSON(&payloadInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := models.GetDB()
	encodedPayload := encodePayload(payloadInput.Payload)
	var endpoint models.Endpoint

	if err := db.Where("id = ?", Endpointid).First(&endpoint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Endpoint not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch endpoint", "cause": err.Error()})
		return
	}

	if err := db.Model(&endpoint).Update("payload", encodedPayload).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payload", "cause": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payload updated successfully",
		"endpoint": gin.H{
			"id":        endpoint.ID,
			"projectId": endpoint.ProjectID,
			"payload":   decodePayload(endpoint.Payload),
		},
	})

}

func Infoaboutpayload(c *gin.Context) {
	Endpointid := c.Param("EndpointID")

	db := models.GetDB()
	var endpoint models.Endpoint

	if err := db.Where("ID = ?", Endpointid).Find(&endpoint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No endpoint found for the given endpointid"})
			return
		}
		log.Printf("Error fetching endpoint for endpointid %s: %v", Endpointid, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	endpoint.Payload = decodePayload(endpoint.Payload)
	c.JSON(http.StatusOK, endpoint)
}

func UpdateAPIType(c *gin.Context) {
	EndpointID := c.Param("endpointID")

	// Input structure with APIType as a slice of strings
	var input struct {
		APIType []string `json:"apiType" binding:"required"`
	}

	// Validate the input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := models.GetDB()
	var endpoint models.Endpoint

	// Fetch the endpoint by ID
	if err := db.Where("id = ?", EndpointID).First(&endpoint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Endpoint not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch endpoint", "cause": err.Error()})
		return
	}

	// Update the APIType field
	if err := db.Model(&endpoint).Update("api_type", pq.StringArray(input.APIType)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update APIType", "cause": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "APIType updated successfully",
		"endpoint": gin.H{
			"id":      endpoint.ID,
			"apiType": input.APIType,
		},
	})
}

func UpdateEndpointScheme(c *gin.Context) {
	EndpointID := c.Param("endpointID")

	var input struct {
		Endpoint string `json:"endpoint" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := models.GetDB()
	var endpoint models.Endpoint

	if err := db.Where("id = ?", EndpointID).First(&endpoint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Endpoint not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch endpoint", "cause": err.Error()})
		return
	}

	if err := db.Model(&endpoint).Update("endpoint", input.Endpoint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Endpoint", "cause": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Endpoint updated successfully",
		"endpoint": gin.H{
			"id":       endpoint.ID,
			"endpoint": input.Endpoint,
		},
	})
}

func UpdateWorking(c *gin.Context) {
	endpointID := c.Param("endpointID")

	if endpointID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Endpoint ID is required",
		})
		return
	}

	db := models.GetDB()
	var endpoint models.Endpoint

	result := db.Where("id = ?", endpointID).First(&endpoint)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Endpoint not found",
			})
			return
		}

		log.Printf("Database error: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch endpoint",
			"cause": result.Error.Error(),
		})
		return
	}

	newWorkingStatus := !endpoint.Working

	if err := db.Model(&endpoint).Update("working", newWorkingStatus).Error; err != nil {
		log.Printf("Update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to toggle Working status",
			"cause": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Working status toggled successfully",
		"endpoint": gin.H{
			"id":      endpoint.ID,
			"working": newWorkingStatus,
		},
	})
}

func Deleteendpoint(c *gin.Context) {
	Endpointid := c.Param("EndpointID")

	db := models.GetDB()
	var endpoint models.Endpoint

	if err := db.Where("ID = ?", Endpointid).Delete(&endpoint).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No endpoint found for the given endpointid"})
			return
		}
	}
	c.JSON(http.StatusOK, endpoint)
}
