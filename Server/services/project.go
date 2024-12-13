package services

import (
	"NyxAPI/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
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

	project := models.Project{
		Title:       projectInput.Title,
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

	fmt.Println(projectInput.Title)
	fmt.Println(projectInput.Description)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Project created successfully",
		"project": gin.H{
			"id":          project.ID,
			"title":       project.Title,
			"userId":      project.UserID,
			"description": project.Description,
			"img":         project.Img,
		},
	})
}
