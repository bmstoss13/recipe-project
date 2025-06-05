import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/RecipeDetail.css';
import ChatAssistant from '../components/ChatBot';
import Comments from '../components/Comments';
import Navbar from "../components/Navbar";
import useCurrentUser from '../components/CurrentUser.jsx'
import { toast } from 'react-toastify';


const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const { user, profile } = useCurrentUser();

  useEffect(() => {
    fetchSaved();
  }, [user])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/create/get/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  const fetchSaved = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:5050/create/user/${user.uid}`);
        const data = response.data;
        setSavedRecipes(data.savedRecipes)

        if (data.savedRecipes.includes(id)) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      } catch (e) {
          console.error("Failed to fetch pending: ", e)
      }
    }
  }

  const addSaved = async () => {
    const updatedSaved = [...savedRecipes, id]
    const body = {
      id: user.uid,
      savedRecipes: updatedSaved
    }
    try {
      const response = await axios.put(`http://localhost:5050/api/recipes/saveRecipe`, body)
      fetchSaved();
    } catch (e) {
      console.error("Error updating saved recipes: ", e);
    }
  }

  const removeSaved = async () => {
    const updatedSaved = savedRecipes.filter(recipeId => recipeId !== id);
    const body = {
      id: user.uid,
      savedRecipes: updatedSaved
    }

    try {
      const response = await axios.put(`http://localhost:5050/api/recipes/saveRecipe`, body)
      setSavedRecipes(updatedSaved);
      fetchSaved();
    } catch (e) {
      console.error("Error updating saved recipes: ", e);
    }
  }

  if (!recipe) {
    return (
      <div className="myrecipe-page-container">
        <Navbar />
        <div className="recipe-detail-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className='myrecipe-page-container'>
      <Navbar />
      <div className="recipe-detail-container">
        <span className="recipeback-text" onClick={() => navigate(-1)}>
          ← Back
        </span>
        <div className="recipe-detail">
          <div className="recipeDetail-header">
            <div className="recipe-text">
              <h1>{recipe.title}</h1>
              <p className="recipe-author">
                By <span className="recipe-author-name" style={{ color: '#f38181' }}>{recipe.username}</span>
              </p>
              <p>{recipe.description}</p>
              <div className="recipe-numbers-container">
                <div className="recipe-numbers-child">
                  <span role="img" aria-label="timer">⏱️</span>
                  <span className="recipe-numbers-text">
                    {parseInt(recipe.prep_time) + parseInt(recipe.cook_time)} mins
                  </span>
                </div>
                <div className="recipe-numbers-child">
                  <span role="img" aria-label="servings">👤</span>
                  <span className="recipe-numbers-text">
                    {parseInt(recipe.servings)} servings
                  </span>
                </div>
              </div>
              <div className="recipe-buttons">
                <button className="outline" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}>Share</button>
                
                {isSaved ? (
                  <button className="solid" onClick={() => removeSaved()}>
                    Unsave Recipe
                  </button>
                ) : (
                  <button className="solid" onClick={() => addSaved()}>
                    Save Recipe
                  </button>
                )}
              </div>
            </div>
            {recipe.image && (
              <div className="recipe-image">
                <img src={recipe.image} alt="Recipe" className="recipe-image-bordered" />
              </div>
            )}
          </div>
          
          <section className="ingredients">
            <h2>Ingredients</h2>
            <div className="ingredients-card">
              <ul>
                {recipe.ingredients?.map((ingredient, idx) => (
                  <li key={idx} className="ingredient-item">{ingredient}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="instructions">
            <h2>Instructions</h2>
            <ul>
              {recipe.instructions?.map((step, index) => (
                <li key={index}>
                  <div className="step-box">
                    <div className="step-text">
                      <strong>Step {index + 1}</strong>
                      <p>{step}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <h2 className="serveInst">Serve and Enjoy!</h2>
          </section>

          <Comments recipeId={id} />
        </div>

        <div className="chat-button">
          💬 Need help?
        </div>
        <ChatAssistant />
      </div>
    </div>
  );
};

export default RecipeDetail;
