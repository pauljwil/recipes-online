package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/pauljwil/recipes-online/server/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

// Collection object/instance
var collection *mongo.Collection

// Create connection with MongoDB
func init() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get environment variables
	connectionString := os.Getenv("MONGODB_CONNECTION_STRING")
	dbName := os.Getenv("MONGODB_DB_NAME")
	collName := os.Getenv("MONGODB_COLLECTION_NAME")

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	collection = client.Database(dbName).Collection(collName)

	fmt.Println("Collection instance created!")
}

// GetAllRecipes defines the route for getting a recipe.
func GetRecipe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	params := mux.Vars(r)

	payload, err := getRecipe(params["name"])
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(payload)
}

// GetAllRecipes defines the route for getting all the recipes.
func GetAllRecipes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	payload, err := getAllRecipes()
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(payload)
}

// AddRecipe defines the route for adding a new recipe.
func AddRecipe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	var recipe models.Recipe
	_ = json.NewDecoder(r.Body).Decode(&recipe)

	err := addRecipe(recipe)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(recipe)
}

// UpdateRecipe defines the route for updating a recipe.
func UpdateRecipe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	var recipe models.Recipe
	_ = json.NewDecoder(r.Body).Decode(&recipe)

	params := mux.Vars(r)

	err := updateRecipe(params["name"], recipe)
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(recipe)
}

// DeleteRecipe defines the route for deleting a recipe.
func DeleteRecipe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	params := mux.Vars(r)
	err := deleteRecipe(params["name"])
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(params["name"])
}

// DeleteAllRecipes defines the route for deleting all recipes.
func DeleteAllRecipes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	count, err := deleteAllRecipes()
	if err != nil {
		log.Println(err)
	}

	json.NewEncoder(w).Encode(count)
}

func getRecipe(name string) (primitive.M, error) {
	var result primitive.M
	err := collection.FindOne(context.Background(), bson.M{"name": name}).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve recipe: %w", err)
	}

	return result, nil
}

// getAllRecipes gets all recipes from the DB and returns them.
func getAllRecipes() ([]primitive.M, error) {
	cur, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to query recipes collection: %w", err)
	}

	defer cur.Close(context.Background())

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result primitive.M

		if err := cur.Decode(&result); err != nil {
			return nil, fmt.Errorf("failed to decode recipe: %w", err)
		}

		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		return nil, fmt.Errorf("query error from cursor: %w", err)
	}

	return results, nil
}

// addRecipe adds one recipe to the DB.
func addRecipe(recipe models.Recipe) error {
	insertResult, err := collection.InsertOne(context.Background(), recipe)
	if err != nil {
		return fmt.Errorf("failed to insert recipe: %w", err)
	}

	fmt.Printf("Inserted a Single Record: %v", insertResult.InsertedID)

	return nil
}

// updateRecipe updates an existing recipe in the DB.
func updateRecipe(name string, recipe models.Recipe) error {
	filter := bson.M{"name": name}
	update := bson.M{
		"$set": bson.M{
			"name":         recipe.Name,
			"ingredients":  recipe.Ingredients,
			"instructions": recipe.Instructions,
			"link":         recipe.Link,
		},
	}

	_, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update recipe: %w", err)
	}

	return nil
}

// deleteRecipe deletes an existing recipe in the DB.
func deleteRecipe(name string) error {
	filter := bson.M{"name": name}

	_, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return fmt.Errorf("failed to delete recipe: %w", err)
	}

	return nil
}

// deleteRecipes deletes all the recipes from the DB.
func deleteAllRecipes() (int64, error) {
	deleteResult, err := collection.DeleteMany(context.Background(), bson.M{})
	if err != nil {
		return 0, fmt.Errorf("failed to delete recipes: %w", err)
	}

	fmt.Println("Deleted documents:", deleteResult.DeletedCount)
	return deleteResult.DeletedCount, nil
}
