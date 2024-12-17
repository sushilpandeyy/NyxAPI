package services

import (
	"NyxAPI/models"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func Nameemailsrecommend(c *gin.Context) {
	Initials := c.Param("userinit") // initials of user's name
	if len(Initials) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Initial letters are required",
		})
		return
	}

	db := models.GetDB()
	var usersList []models.User

	result := db.Where("LOWER(name) LIKE ?", strings.ToLower(Initials)+"%").
		Select("id", "name", "email").
		Limit(10).
		Find(&usersList)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve users",
			"details": result.Error.Error(),
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "No users found matching the initial",
			"initial": Initials,
		})
		return
	}

	var recommendations []gin.H
	for _, user := range usersList {
		recommendations = append(recommendations, gin.H{
			"name":  user.Name,
			"email": user.Email,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"recommendations": recommendations,
		"count":           len(recommendations),
		"initial":         Initials,
	})
}

func Addemail(c *gin.Context) {
	newemail := c.Param("email")
	projectid := c.Param("projid")

	log.Printf("Project ID: %s", projectid)
	log.Printf("New Email: %s", newemail)

	db := models.GetDB()

	var project models.Project
	var user models.User
	userExists := true

	projID, err := strconv.ParseUint(projectid, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	if err := db.Where("id = ?", projID).First(&project).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch project", "cause": err.Error()})
		return
	}

	for _, sharedEmail := range project.Shared {
		if sharedEmail == newemail {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already shared for this project"})
			return
		}
	}

	if err := db.Model(&project).Update("Shared", pq.Array(append(project.Shared, newemail))).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shared emails", "cause": err.Error()})
		return
	}

	if err := db.Where("email = ?", newemail).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			userExists = false
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user", "cause": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Added new member to project",
		"exists":  userExists,
		"project": gin.H{
			"id":     project.ID,
			"title":  project.Title,
			"shared": project.Shared,
		},
	})
}
