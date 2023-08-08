package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	ID           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name         string             `json:"name,omitempty"`
	Ingredients  string             `json:"ingredients,omitempty"`
	Instructions string             `json:"instructions,omitempty"`
	Link         string             `json:"link,omitempty"`
}

type Ingredient struct {
	Item     string `json:"item,omitempty"`
	Quantity string `json:"quantity,omitempty"`
}
