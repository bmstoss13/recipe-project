import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../styles/RecipeCard.css"
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecipeCard = ({ recipe, isOfficial, onSaveRecipe, isSaved }) => {
    const title = isOfficial ? recipe.recipe.label : recipe.title;
    const imageUrl = isOfficial ? recipe.recipe.image : recipe.image;
    const id = isOfficial ? encodeURIComponent(recipe.recipe.uri) : recipe.id;

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
    return (
        <div className="recipe-card">
            <Link to={`/recipes/${id}?type=${isOfficial ? 'edamam' : 'user'}`}>
                <img src={imageUrl || 'vite.svg'} alt={title} />
            </Link>

            <div className="recipe-card-content">
                <h3>{title}</h3>
                <p>{isOfficial ? recipe.recipe.dishType : recipe.description || "User-submitted"}</p>
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