import React from "react";
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, isOfficial, onSaveRecipe }) => {
    const title = isOfficial ? recipe.recipe.label : recipe.title;
    const imageUrl = isOfficial ? recipe.recipe.image : recipe.image;
    const id = isOfficial ? encodeURIComponent(recipe.recipe.uri) : recipe.id;

    const handleSave = () => {
        if (onSaveRecipe && isOfficial) {
            onSaveRecipe(recipe.recipe.uri);
        }
    };
    return(
        <div>
            <Link to={`/recipes/${id}?type=${isOfficial ? 'edamam' : 'user'}`}>
                <img src={imageUrl || 'vite.svg'} alt={title} />
                <h3>{title}</h3>
            </Link>
            {isOfficial && (
                <button onClick={handleSave}>Save Recipe</button>
            )}
        </div>
    );
};

export default RecipeCard;