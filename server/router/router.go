package router

import (
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/pauljwil/recipes-online/server/middleware"
)

// Router is exported and used in main.go
func Router() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/api/recipes/{name}", middleware.GetRecipe).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/recipes", middleware.GetAllRecipes).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/recipes", middleware.AddRecipe).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/recipes/{name}", middleware.UpdateRecipe).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/recipes/{name}", middleware.DeleteRecipe).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/recipes", middleware.DeleteAllRecipes).Methods("DELETE", "OPTIONS")

	// Create the CORS handler with allowed origins, methods, and headers
	allowedOrigins := handlers.AllowedOrigins([]string{"*"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

	// Wrap the router with the CORS middleware
	corsRouter := handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(router)

	return corsRouter
}
