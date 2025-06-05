import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import '../styles/RecipeDetail.css';
import ChatAssistant from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';
import Navbar from "../components/Navbar";
import { CiImageOn } from 'react-icons/ci';

const EdamamRecipeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEdamamRecipeDetails = async() => {
            setLoading(true);
            setError(null);
            try {
                const encodedIdForBackend = encodeURIComponent(id);
                const url = `/api/recipes/edamam/${encodedIdForBackend}`;
                const response = await axios.get(url);
                setRecipeDetails(response.data);
            }
            catch(e){
                console.error("Error fetching Edamam recipe details: " + e.response?.data?.error || e.message || e);
                setError(e.response?.data?.error || "Failed to fetch Edamam recipe details.");
                toast.error(e.response?.data?.error || "Failed to load recipe.");
            }
            finally{
                setLoading(false);
            }
        };
        if (id) {
            fetchEdamamRecipeDetails();
        }
        else {
            setError("Recipe ID (URI) is missing from the URL.");
            setLoading(false);
        }
    }, [id]);

    if(loading) {
        return (
            <div className="myrecipe-page-container">
                <Navbar />
                <div className="recipe-detail-container">
                    <span className="recipeback-text" onClick={() => navigate(-1)}>
                        ← Back
                    </span>
                    <p>Loading Edamam recipe details...</p>
                </div>
            </div>
        );
    }

    if (error){
        return(
            <div className="myrecipe-page-container">
                <Navbar />
                <div className="recipe-detail-container">
                    <span className="recipeback-text" onClick={() => navigate(-1)}>
                        ← Back
                    </span>
                    <p className="error-message">{error}</p>
                </div>
            </div>
        )
    }

    if (!recipeDetails) {
        return (
            <div className="myrecipe-page-container">
                <Navbar />
                <div className="recipe-detail-container">
                    <span className="recipeback-text" onClick={() => navigate(-1)}>
                        ← Back
                    </span>
                    <p>Edamam recipe not found or no recipe details available. Please try another recipe</p>
                </div>
            </div>
        );
    }

    const title = recipeDetails.label;
    const description = recipeDetails.cuisineType?.join(', ') || recipeDetails.mealType?.join(', ') || 'Official Edamam Recipe';
    const image = recipeDetails.image;
    const ingredients = recipeDetails.ingredients;
    const sourceUrl = recipeDetails.source.url || recipeDetails.uri;
    const sourceName = recipeDetails.source;

  return (
    <div className='myrecipe-page-container'>
    <Navbar/>
    <div className="recipe-detail-container">
      <span className="recipeback-text" onClick={() => navigate(-1)}>
        ← Back
      </span>
        <div className="recipe-detail">
        <div className="recipeDetail-header">
            <div className="recipe-text">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="recipe-buttons">
                <button className="outline">Share</button>
                <button className="solid">Save Recipe</button>
            </div>
            </div>
            <div className="recipe-image">
                {image ? (
                    <img src={image} alt={title} className="recipe-image-bordered" />
                ) : (
                    <CiImageOn className="no-image-placeholder" /> 
                )}

            </div>
        </div>

        <section className="ingredients-section">
            <h2>Ingredients</h2>
            <ul>
                {ingredients && ingredients.length > 0 ? (
                    ingredients.map((ing, index) => (
                        <li key={index}>{ing.text}</li>
                    ))
                ) : (
                    <li>No ingredients listed. Please reference the source of the recipe.</li>
                )}
            </ul>
        </section>

        <section className="instructions">
            <h2>Instructions</h2>
            {sourceUrl ? (
                <p>
                    For detailed instructions, please visit the original source:{" "}
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                        {sourceName || "Original Recipe Page"}
                    </a>
                </p>
            ) : (
                <p>Instructions not available directly from Edamam. Please check the source link if provided.</p>
            )}
        </section>

        {recipeDetails.totalNutrients && (
            <section className="nutrition-info">
                <h2>Nutrition Information (Per Serving)</h2>
                <p>Calories: {recipeDetails.calories ? recipeDetails.calories.toFixed(0) : 'N/A'} kcal</p>
                <p>Protein: {recipeDetails.totalNutrients.PROCNT?.quantity.toFixed(1) || 'N/A'} {recipeDetails.totalNutrients.PROCNT?.unit || ''}</p>
                <p>Fat: {recipeDetails.totalNutrients.FAT?.quantity.toFixed(1) || 'N/A'} {recipeDetails.totalNutrients.FAT?.unit || ''}</p>
                <p>Carbs: {recipeDetails.totalNutrients.CHOCDF?.quantity.toFixed(1) || 'N/A'} {recipeDetails.totalNutrients.CHOCDF?.unit || ''}</p>   
            </section>
        )}

        <Comments />
    </div>

      <div className="chat-button" onClick={() => alert("AI Assistant coming soon!")}>
        💬 Need help?
      </div>
      <ChatAssistant />
    </div>
    </div>
  );
};

export default EdamamRecipeDetail;
