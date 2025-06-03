import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';


import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/CreateRecipe.css'

function CreateRecipe() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleIngredientChange = (idx, e) => {
    const newIngredients = [...ingredients];
    newIngredients[idx] = e.target.value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    const newIngredients = [...ingredients, ''];
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (idx) => {
    const newIngredients = ingredients.filter((_, i) => i !== idx);
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (idx, e) => {
    const newInstructions = [...instructions];
    newInstructions[idx] = e.target.value;
    setInstructions(newInstructions);
  };

  const handleAddInstruction = () => {
    const newInstructions = [...instructions, ''];
    setInstructions(newInstructions);
  };

  const handleRemoveInstruction = (idx) => {
    const newInstructions = instructions.filter((_, i) => i !== idx);
    setInstructions(newInstructions);
  };

  const submitRecipe = async () => {
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Recipe Name is required.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }

    if (ingredients.some(ingredient => ingredient.trim() === '')) {
        setErrorMessage("Please ensure all ingredient fields are filled out.");
        return;
    }

    if (instructions.some(inst => inst.trim() === '')) {
        setErrorMessage("Please ensure all instruction fields are filled out.");
        return;
    }

    const data = {
      "user_id": "tempid",
      "title": name,
      "description": description,
      "prep_time": prepTime,
      "cook_time": cookTime,
      "servings": servings,
      "ingredients": ingredients,
      "instructions": instructions
    }

    try {
      const response = await axios.post('http://localhost:5050/create/recipe', data);

      if (response.status === 200) {
        console.log(response.data)
        // navigate()
      } else {
        console.error("Failed to submit recipe.");
      }
    } catch (e) {
      console.error("Failed to submit recipe: ", e);
    }
  }

  return (
    <div>
      <div className="createRecipeMain">
        <div className="createRecipeContainer">
          <div className="createRecipeHeaderContainer">
            <div className="createRecipeMainText">Submit a Recipe</div>
            <div className="createRecipeSubText">Share your favorite recipe with our community</div>
          </div>
          <form>
            <div className="createRecipeFormContainer">
              <div className="createRecipeFormHeader">
                <div className="createRecipeFormMainText">Recipe Details</div>
                <div className="createRecipeFormSubText">Tell us about your recipe</div>
              </div>
              <div className="createRecipeTitleContainer">
                <div className="createRecipeFormLabel">Recipe Name</div>
                <input className="createRecipeTitleInput" type="text" placeholder="Your recipe name..." value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="createRecipeDescriptionContainer">
                <div className="createRecipeFormLabel">Description</div>
                <textarea className="createRecipeDescriptionInput" placeholder="Describe your recipe..." value={description} onChange={(e) => setDescription(e.target.value)}/>
              </div>
              <div className="createRecipeNumbersContainer">
                <div className="createRecipeNumbersChild">
                  <div className="createRecipeFormLabel">Prep Time (minutes)</div>
                  <input className="createRecipeNumberInput" type="number" placeholder="0" value={prepTime} onChange={(e) => {
                      if (e.target.value < 1) {
                        setPrepTime(1)
                      } else {
                        setPrepTime(e.target.value)
                      }
                    }}/>
                </div>
                <div className="createRecipeNumbersChild">
                  <div className="createRecipeFormLabel">Cook Time (minutes)</div>
                  <input className="createRecipeNumberInput" type="number" placeholder="0" value={cookTime} onChange={(e) => {
                    if (e.target.value < 1) {
                      setCookTime(1)
                    } else {
                      setCookTime(e.target.value)
                    }
                  }}/>
                </div>
                <div className="createRecipeNumbersChild">
                  <div className="createRecipeFormLabel">Servings</div>
                  <input className="createRecipeNumberInput" type="number" placeholder="0" value={servings} onChange={(e) => {
                    if (e.target.value < 1) {
                      setServings(1)
                    } else {
                      setServings(e.target.value)
                    }
                  }}/>
                </div>
              </div>
            </div>
            <div className="createRecipeFormContainer">
              <div className="createRecipeFormHeader">
                <div className="createRecipeFormMainText">Ingredients</div>
                <div className="createRecipeFormSubText">List the ingredients needed for your recipe</div>
              </div>
              <div className="createRecipeIngredientsContainer">
                {ingredients.length <= 1 ? (
                  ingredients.map((ingredient, index) => (
                      <input key={index} className="createRecipeIngredientInput" type="text" placeholder={`Ingredient ${index + 1}...`} value={ingredient} onChange={(e) => handleIngredientChange(index, e)}/>
                  ))
                ) : (
                  ingredients.map((ingredient, index) => (
                    <div key={index} className="createRecipeIngredientsChild">
                      <input className="createRecipeIngredientInput" type="text" placeholder={`Ingredient ${index + 1}...`} value={ingredient} onChange={(e) => handleIngredientChange(index, e)}/>
                      <button className="createRecipeDeleteIngredientButton" type="button" onClick={() => handleRemoveIngredient(index)}><DeleteIcon/></button>
                    </div>
                  ))
                )}
                <button className="createRecipeAddIngredientButton" type="button" onClick={() => handleAddIngredient()}>Add Ingredient</button>
              </div>
            </div>
            <div className="createRecipeFormContainer">
              <div className="createRecipeFormHeader">
                <div className="createRecipeFormMainText">Instructions</div>
                <div className="createRecipeFormSubText">List your step-by-step cooking instructions</div>
              </div>
              <div className="createRecipeIngredientsContainer">
                {instructions.length <= 1 ? (
                  instructions.map((instruction, index) => (
                      <textarea key={index} className="createRecipeInstructionInput" placeholder={`Step ${index + 1} instructions...`} value={instruction} onChange={(e) => handleInstructionChange(index, e)}/>
                  ))
                ) : (
                  instructions.map((instruction, index) => (
                    <div key={index} className="createRecipeIngredientsChild">
                      <textarea className="createRecipeInstructionInput" placeholder={`Step ${index + 1} instructions...`} value={instruction} onChange={(e) => handleInstructionChange(index, e)}/>
                      <button className="createRecipeDeleteIngredientButton" type="button" onClick={() => handleRemoveInstruction(index)}><DeleteIcon/></button>
                    </div>
                  ))
                )}
                <button className="createRecipeAddIngredientButton" type="button" onClick={() => handleAddInstruction()}>Add Step</button>
              </div>
            </div>
            <div className="createRecipeErrorMessage">{errorMessage}</div>
            <button className="createRecipeSubmit" type="button" onClick={() => submitRecipe()}>Submit Recipe</button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default CreateRecipe;