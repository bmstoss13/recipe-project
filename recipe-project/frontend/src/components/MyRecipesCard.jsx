import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import "../styles/MyRecipesCard.css";

export default function RecipeCard({
  recipe,
  tab,
  onView,
  onEdit,
  onDelete,
  onSave,
  onUnsave,
  isSaved,
}) {
  return (
    <div className="my-recipes-card">
      <div className="my-recipes-image-container">
        <span className="my-recipes-image" role="img" aria-label="recipe"><CiImageOn /></span>
      </div>
      <div className="my-recipes-content-container">
        <div className="my-recipes-title">{recipe.title}</div>
        <div className="my-recipes-description">{recipe.description}</div>
        <div className="my-recipes-actions" style={{ justifyContent: 'flex-end' }}>
          <button onClick={onView} className="my-recipes-icon-btn" title="View"><IoEyeOutline /></button>
          {tab === "created" ? (
            <>
              <button onClick={isSaved ? onUnsave : onSave} className="my-recipes-icon-btn" title={isSaved ? "Unsave" : "Save"}>
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <button onClick={onEdit} className="my-recipes-icon-btn" title="Edit"><FaRegEdit /></button>
              <button onClick={onDelete} className="my-recipes-icon-btn" title="Delete"><RiDeleteBin6Line /></button>
            </>
          ) : (
            <button onClick={onUnsave} className="my-recipes-icon-btn" title="Unsave"><FaBookmark /></button>
          )}
        </div>
      </div>
    </div>
  );
}