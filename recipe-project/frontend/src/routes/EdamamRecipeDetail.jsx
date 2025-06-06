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
import useCurrentUser from '../components/CurrentUser.jsx';

const EdamamRecipeDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useCurrentUser();
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isSaved, setIsSaved] = useState(false);


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

    useEffect(() => {
        const fetchSaved = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5050/create/user/${user.uid}`);
                    const data = response.data;
                    setSavedRecipes(data.savedRecipes);

                    const encodedUri = encodeURIComponent(id);
                    setIsSaved(data.savedRecipes.includes(encodedUri));
                } catch (e) {
                    console.error("Failed to fetch saved recipes:", e);
                }
            }
        };

        fetchSaved();
    }, [user, id]);

    const addSaved = async () => {
        const encodedUri = encodeURIComponent(id);
        const updatedSaved = [...savedRecipes, encodedUri];
        const body = {
            id: user.uid,
            savedRecipes: updatedSaved
        };
        try {
            await axios.put(`http://localhost:5050/api/recipes/saveRecipe`, body);
            toast.success("Recipe saved!");
            setSavedRecipes(updatedSaved);
            setIsSaved(true);
        } catch (e) {
            console.error("Error saving recipe:", e);
            toast.error("Failed to save recipe.");
        }
    };

    const removeSaved = async () => {
        const encodedUri = encodeURIComponent(id);
        const updatedSaved = savedRecipes.filter(recipeId => recipeId !== encodedUri);
        const body = {
            id: user.uid,
            savedRecipes: updatedSaved
        };
        try {
            await axios.put(`http://localhost:5050/api/recipes/saveRecipe`, body);
            toast.success("Recipe removed.");
            setSavedRecipes(updatedSaved);
            setIsSaved(false);
        } catch (e) {
            console.error("Error removing saved recipe:", e);
            toast.error("Failed to remove recipe.");
        }
    };



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
                <button
                    className="outline"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                    }}
                >
                    Share
                </button>
                {isSaved ? (
                    <button className="solid" onClick={removeSaved}>Unsave Recipe</button>
                ) : (
                    <button className="solid" onClick={addSaved}>Save Recipe</button>
                )}
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
            <div className="ingredients-card">
            <ul>
                {ingredients && ingredients.length > 0 ? (
                    ingredients.map((ing, index) => (
                        <li key={index} className="ingredient-item">{ing.text}</li>
                    ))
                ) : (
                    <li>No ingredients listed. Please reference the source of the recipe.</li>
                )}
            </ul>
            </div>
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

        <Comments recipeId={id}/>
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
