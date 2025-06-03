import React from "react";
import "../styles/MyRecipesCard.css";

export default function MyRecipesCard({ recipe, onEdit, onDelete, onSave, onUnsave, isSaved, onView }) {
  // Helper to stop event bubbling from action buttons
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="myRecipesCard myRecipesCard-clickable" onClick={onView}>
      <div className="myRecipesCard-image">
        {/* Placeholder icon (SVG or emoji) */}
        <span className="myRecipesCard-imageIcon" role="img" aria-label="image">🖼️</span>
      </div>
      <div className="myRecipesCard-bottom">
        <div className="myRecipesCard-info">
          <div className="myRecipesCard-title">{recipe.title}</div>
          <div className="myRecipesCard-desc">{recipe.description}</div>
        </div>
        <div className="myRecipesCard-actions">
          <button onClick={(e) => { stopPropagation(e); isSaved ? onUnsave() : onSave(); }} className="myRecipesCard-iconBtn" title={isSaved ? "Unsave" : "Save"}>
            <span role="img" aria-label="save">🔖</span>
          </button>
          <button onClick={(e) => { stopPropagation(e); onEdit(); }} className="myRecipesCard-iconBtn" title="Edit">
            <span role="img" aria-label="edit">✏️</span>
          </button>
          <button onClick={(e) => { stopPropagation(e); onDelete(); }} className="myRecipesCard-iconBtn" title="Delete">
            <span role="img" aria-label="delete">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
} 