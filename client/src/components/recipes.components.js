import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Modal } from 'react-bootstrap';
import Recipe from './single-recipe.component';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [addNewRecipe, setAddNewRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ name: '', ingredients: '', instructions: '', link: '' });

  // Gets run at initial loadup and when refreshData changes
  useEffect(() => {
    getAllRecipes();
  }, [refreshData]);

  // Gets all the recipes
  function getAllRecipes() {
    var url = 'http://localhost:9090/api/recipes';
    axios.get(url, { responseType: 'json' }).then(response => {
      if (response.status === 200) {
        setRecipes(response.data);
      }
    });
  }

  // Creates a new recipe
  function addSingleRecipe() {
    setAddNewRecipe(false);
    var url = 'http://localhost:9090/api/recipes';
    axios.post(url, {
      name: newRecipe.name,
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
      link: newRecipe.link
    }).then(response => {
      if (response.status === 200) {
        setRefreshData(!refreshData);
      }
    });
  }

  // Deletes a single recipe
  function deleteSingleRecipe(name) {
    var url = 'http://localhost:9090/api/recipes/' + name;
    axios.delete(url).then(response => {
      if (response.status === 200) {
        setRefreshData(!refreshData);
      }
    });
  }

  // Deletes all recipes
  function deleteAllRecipes() {
    var url = 'http://localhost:9090/api/recipes';
    axios.delete(url).then(response => {
      if (response.status === 200) {
        setRefreshData(!refreshData);
      }
    });
  }

  return (
    <div>
      {/* add new recipe button */}
      <Container>
        <Button onClick={() => setAddNewRecipe(true)}>Add new recipe</Button>
      </Container>

      {/* list all recipes */}
      <Container>
        {recipes != null &&
          recipes.map((recipe, i) => (
            <Recipe
              recipeData={recipe}
              deleteSingleRecipe={deleteSingleRecipe}
              setRefreshData={setRefreshData}
              setNewRecipe={setNewRecipe}
              key={i}
            />
          ))}
      </Container>

      {/* add new recipe button */}
      <Container>
        <Button onClick={() => deleteAllRecipes()}>Delete all recipes</Button>
      </Container>

      {/* popup for adding a new recipe */}
      <Modal show={addNewRecipe} onHide={() => setAddNewRecipe(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={event => setNewRecipe(prevRecipe => ({ ...prevRecipe, name: event.target.value }))}
            />
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              onChange={event => setNewRecipe(prevRecipe => ({ ...prevRecipe, ingredients: event.target.value }))}
            />
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              onChange={event => setNewRecipe(prevRecipe => ({ ...prevRecipe, instructions: event.target.value }))}
            />
            <Form.Label>Link</Form.Label>
            <Form.Control
              onChange={event => setNewRecipe(prevRecipe => ({ ...prevRecipe, link: event.target.value }))}
            />
          </Form.Group>
          <Button onClick={() => addSingleRecipe()}>Add</Button>
          <Button onClick={() => setAddNewRecipe(false)}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Recipes;