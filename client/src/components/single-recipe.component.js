import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Card, Row, Col, Modal, Form } from 'react-bootstrap';

const Recipe = ({ recipeData, deleteSingleRecipe, setRefreshData, setNewRecipe }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingRecipeData, setUpdatingRecipeData] = useState({});

  // Function to fetch the recipe details
  const fetchRecipeDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:9090/api/recipes/${recipeData.name}`);
      const recipeDetails = response.data;
      setRecipeDetails(recipeDetails);
    } catch (error) {
      setError('Error fetching recipe details');
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  }, [recipeData.name]);

  // Fetch the recipe details when the component mounts or when the recipeData changes
  useEffect(() => {
    if (showDetails) {
      fetchRecipeDetails();
    }
  }, [showDetails, fetchRecipeDetails, recipeData]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Function to handle updating a recipe
  const handleUpdateRecipe = () => {
    setNewRecipe({
      ...updatingRecipeData,
      name: updatingRecipeData.name,
      ingredients: updatingRecipeData.ingredients,
      instructions: updatingRecipeData.instructions,
      link: updatingRecipeData.link,
    });

    var url = `http://localhost:9090/api/recipes/${updatingRecipeData.name}`;
    axios.put(url, {
      name: updatingRecipeData.name,
      ingredients: updatingRecipeData.ingredients,
      instructions: updatingRecipeData.instructions,
      link: updatingRecipeData.link,
    }).then((response) => {
      if (response.status === 200) {
        setRefreshData(true);
        setUpdatingRecipeData({});
      }
    })
    .catch((error) => {
        // Handle any errors during the update process if needed
        console.error('Error updating recipe:', error);
      });
  };

  // Render the recipe details if available
  const renderRecipeDetails = () => {
    if (loading) {
      return <p>Loading recipe details...</p>;
    } else if (error) {
      return <p>Error fetching recipe details. Please try again later.</p>;
    } else if (recipeDetails) {
      return (
        <div>
          <h4>Name: {recipeData.name}</h4>
          <h4>Ingredients:</h4>
          <p>{recipeDetails.ingredients}</p>
          <h4>Instructions:</h4>
          <p>{recipeDetails.instructions}</p>
          <h4>Link:</h4>
          <a href={recipeDetails.link}>{recipeDetails.link}</a>
        </div>
      );
    } else {
      return null;
    }
  };

  const updateRecipe = () => {
    setUpdatingRecipeData(recipeData);
  };

  return (
    <Card>
      <Row>
        <Col>Name: {recipeData !== undefined && recipeData.name}</Col>
        <Col>
          <Button onClick={() => deleteSingleRecipe(recipeData.name)}>Delete recipe</Button>
        </Col>
        <Col>
          <Button onClick={updateRecipe}>Update recipe</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <button onClick={toggleDetails}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          {showDetails && renderRecipeDetails()}
        </Col>
      </Row>

      {/* Update recipe popup */}
      <Modal show={updatingRecipeData.name !== undefined} onHide={() => setUpdatingRecipeData({})} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={updatingRecipeData.name || ''}
              onChange={(event) => setUpdatingRecipeData({ ...updatingRecipeData, name: event.target.value })}
            />
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              value={updatingRecipeData.ingredients || ''}
              onChange={(event) => setUpdatingRecipeData({ ...updatingRecipeData, ingredients: event.target.value })}
            />
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              value={updatingRecipeData.instructions || ''}
              onChange={(event) => setUpdatingRecipeData({ ...updatingRecipeData, instructions: event.target.value })}
            />
            <Form.Label>Link</Form.Label>
            <Form.Control
              value={updatingRecipeData.link || ''}
              onChange={(event) => setUpdatingRecipeData({ ...updatingRecipeData, link: event.target.value })}
            />
          </Form.Group>
          <Button onClick={handleUpdateRecipe}>Update</Button>
          <Button onClick={() => setUpdatingRecipeData({})}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Recipe;