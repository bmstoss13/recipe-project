import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "../styles/RecipeCard.css"
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecipeCard = ({ recipe, isOfficial, onSaveRecipe }) => {
    const title = isOfficial ? recipe.recipe.label : recipe.title;
    const imageUrl = isOfficial ? recipe.recipe.image : recipe.image;
    const id = isOfficial ? encodeURIComponent(recipe.recipe.uri) : recipe.id;

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        const toggled = !isSaved;
        setIsSaved(toggled);
        if (toggled){
            toast.success("Recipe saved to My Recipes page!");
        }
        else {
            toast.info("Recipe removed from your saved list.");
        }
        if (onSaveRecipe && isOfficial) {
            onSaveRecipe(recipe.recipe.uri);
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
                className={`bookmark-btn ${isSaved ? 'saved' : ''}`} 
                onClick={handleSave}
                aria-label="Save Recipe"
            >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
        </div>
    );
};

export default RecipeCard;