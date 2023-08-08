# Recipes Online

Single-page web application for storing your recipes online.

Add, update, and delete recipes in a single-page user interface. This web
application uses a Go and React-based server/client architecture to store
recipes in a MongoDB database:

## Table of contents
* [Installation](#installation)
* [Usage](#usage)
* [API reference](#api-reference)
* [Technologies used](#technologies-used)

## Installation

1. Install the latest version of Go and React on your system.
2. Set up an account with MongoDB.
3. Whitelist your IP address.
4. Create an admin user.
5. Create a database and collection.
6. Obtain the connection string for your MongoDB cluster.
7. Clone the recipes repository.
6. Create an `.env` file at the root of your recipes repository.
7. Include the following text in your `.env` file:

   ```
   MONGODB_CONNECTION_STRING=<mongodb-connection-string>
   MONGODB_DB_NAME=<database-name>
   MONGODB_COLLECTION_NAME=<collection-name>
   ```
8. From the `client` directory, run `npm install` to install dependencies.
9. From the `server` directory, run `go run main.go` to build and run the
   recipes backend.
10. From the `client` directory, run `npm start` to start the recipes frontend.
11. In your web browser, navigate to `http://localhost:3000` to begin using the
    Recipes Online web application.

## Usage

## API reference

## Technologies used