import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../styles/RecipeCard.css"
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiImageOn } from "react-icons/ci";


const RecipeCard = ({ recipe, isOfficial, onSaveRecipe, isSaved }) => {
    const title = isOfficial ? recipe?.recipe?.label : recipe.title;
    const imageUrl = isOfficial ? recipe?.recipe?.image : recipe.image;
    const id = isOfficial ? encodeURIComponent(recipe?.recipe?.uri) : recipe.id;

    const [saved, setSaved] = useState(isSaved);

    useEffect(() => {
        setSaved(isSaved);
    }, [isSaved]);

    const handleSave = () => {
        const toggled = !saved;
        setSaved(toggled);

        if (toggled) {
            toast.success("Recipe saved to My Recipes page!");
        } 
        else {
            toast.info("Recipe removed from your saved list.");
        }

        if (onSaveRecipe) {
            const id = isOfficial ? encodeURIComponent(recipe.recipe.uri) : recipe.id;
            const type = isOfficial ? 'edamam' : 'user-generated';

            const entry = {
                id,
                type
            };

            onSaveRecipe(entry); 
        }
    };

    const detailPagePath = isOfficial ? `/edamam-recipeDetail/${id}` : `/recipeDetail/${id}`;

    return (
        <div className="recipe-card">
            <Link to={detailPagePath}>
                <div className="recipe-image-container"> 
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="recipe-image-content" />
                    ) : (
                        <CiImageOn className="recipe-image" /> 
                    )}
                </div>
            </Link>

            <div className="recipe-card-content">
                <h3>{title}</h3>
                <p>{isOfficial ? recipe?.recipe?.dishType : recipe.description || "User-submitted"}</p>
            </div>

            <button 
                className={`bookmark-btn ${saved ? 'Unsave' : 'Save'}`} 
                onClick={handleSave}
                aria-label="Save Recipe"
            >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
        </div>
    );
};

export default RecipeCard;