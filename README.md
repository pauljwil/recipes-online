# Recipes Online

Single-page web application for storing your recipes online.

Add, update, and delete recipes in a single-page user interface. This web
application uses a Go and React-based server/client architecture to store
recipes in a MongoDB database:

## Table of contents
* [Installation](#installation)
* [API reference](#api-reference)
* [Technologies used](#technologies-used)

## Installation

1. Install the latest version of Go and React on your system.
2. Set up an account with MongoDB.
3. Whitelist your IP address.
4. Create an admin user.
5. Create a database and collection.
6. Obtain the connection string for your MongoDB cluster.
7. Clone the recipes-online repository.
6. Create an `.env` file at the root of the `server` directory.
7. Include the following text in your `.env` file:

   ```
   MONGODB_CONNECTION_STRING=<mongodb-connection-string>
   MONGODB_DB_NAME=<database-name>
   MONGODB_COLLECTION_NAME=<collection-name>
   ```
8. From the `server` directory, run `go run main.go` to build and run the
   recipes-online backend.
9. From the `client` directory, run `npm install` to install dependencies.
10. Run `npm start` to start the recipes-online frontend.
11. In your web browser, navigate to `http://localhost:3000` to begin using the
    Recipes Online web application.

## API reference

The API endpoints used in this application are provided here for your
reference, though the user will not directly interact with them.

### Get all recipes

Obtain a list of all recipes.

**Endpoint:** `GET /api/recipes`

**Response:**

```json
[
  {
    "_id": "<recipe-1-id>",
    "ingredients": "<ingredients>",
    "instructions": "<instructions>",
    "link": "<link>",
    "name": "<recipe-name>"
  },
  {
    "_id": "<recipe-2-id>",
    "ingredients": "<ingredients>",
    "instructions": "<instructions>",
    "link": "<link>",
    "name": "<recipe-name>"
  },
]
```

### Get recipe by name

Obtain a specific recipe by providing its name.

**Endpoint:** `GET /api/recipes/{name}`

**Parameters:**

* `{name}`: The name of the recipe.

**Response:**

```json
{
  "_id": "<recipe-id>",
  "ingredients": "<ingredients>",
  "instructions": "<instructions>",
  "link": "<link>",
  "name": "<recipe-name>"
},
```

### Create recipe

Create a new recipe.

**Endpoint:** `POST /api/recipes`

**Request body:**

```json
{
  "ingredients": "<ingredients>",
  "instructions": "<instructions>",
  "link": "<link>",
  "name": "<recipe-name>"
},
```

**Response:**

```json
{
  "_id": "<recipe-id>",
  "ingredients": "<ingredients>",
  "instructions": "<instructions>",
  "link": "<link>",
  "name": "<recipe-name>"
},
```

### Update recipe

Update an existing recipe by providing its name.

**Endpoint:** `PUT /api/recipes/{name}`

**Parameters:**

* `{name}`: The name of the recipe to update.

**Request body:**

```json
{
  "ingredients": "<updated-ingredients>",
}
```

```json
{
  "_id": "<recipe-id>",
  "ingredients": "<updated-ingredients>",
  "instructions": "<instructions>",
  "link": "<link>",
  "name": "<recipe-name>"
},
```

### Delete recipe

Delete a recipe by providing its name

**Endpoint:** `DELETE /api/recipes/{name}`

**Parameters:**

* `{name}`: The name of the recipe to delete.

**Response:**

```json
"<recipe-name>"
```

Response:

### Delete all recipes

Delete all recipes.

**Endpoint:** `DELETE /api/recipes/`

**Response:**

```json
<number-of-deleted-recipes>
```

## Technologies used

### Backend

* Go
* Gorilla Mux
* MongoDB
* MongoDB Go Driver
* dotenv

### Frontend

* React
* React Bootstrap
* Axios
