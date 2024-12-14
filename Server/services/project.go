package services

import (
	"NyxAPI/models"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateProjectHandler(c *gin.Context) {
	var projectInput struct {
		Title       string `json:"title" binding:"required,min=3,max=100"`
		UserID      uint   `json:"userId" binding:"required"`
		Description string `json:"description" binding:"omitempty,max=500"`
		Img         string `json:"img" binding:"omitempty,url"`
	}

	if err := c.ShouldBindJSON(&projectInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subdomainID, err := GenerateUniqueSubdomainID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to generate unique subdomain ID: %v", err)})
		return
	}

	project := models.Project{
		Title:       projectInput.Title,
		Subdomain:   subdomainID,
		UserID:      projectInput.UserID,
		Description: projectInput.Description,
		Img:         projectInput.Img,
	}

	db := models.GetDB()
	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create project",
			"cause": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Project created successfully",
		"project": gin.H{
			"id":          project.ID,
			"subdomain":   project.Subdomain,
			"title":       project.Title,
			"userId":      project.UserID,
			"description": project.Description,
			"img":         project.Img,
		},
	})
}

func GetallProject(c *gin.Context) {
	userID := c.Param("userid")

	db := models.GetDB()
	var projects []models.Project

	if err := db.Where("user_id = ?", userID).Find(&projects).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No projects found for the given user"})
			return
		}
		log.Printf("Error fetching projects for user %s: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

func GenerateUniqueSubdomainID() (int, error) {
	db := models.GetDB()
	var project models.Project

	rand.Seed(time.Now().UnixNano())

	for {
		id := rand.Intn(900000) + 100000
		if err := db.Where("subdomain = ?", id).First(&project).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return id, nil
			}
			return 0, err
		}
	}
}
