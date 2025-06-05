import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import "../styles/MyRecipesCard.css";
import { Tooltip } from 'react-tooltip';
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Prevent card click when clicking on action buttons
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="my-recipes-card"
      onClick={() => navigate(`/recipeDetail/${recipe.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="my-recipes-image-container">
        <span className="my-recipes-image" role="img" aria-label="recipe"><CiImageOn /></span>
      </div>
      <div className="my-recipes-content-container">
        <div className="my-recipes-title">{recipe.title}</div>
        <div className="my-recipes-description-container">
          <div className="my-recipes-description">{recipe.description}</div>
        </div>
        <div className="my-recipes-actions" style={{ justifyContent: 'flex-end' }}>
            <button
                onClick={(e) => { stopPropagation(e); onView(); }}
                data-tooltip-id={`view-tooltip-${recipe.id}`}
                data-tooltip-content="View"
                className="my-recipes-icon-btn"
            >
                <IoEyeOutline />
            </button>
            <Tooltip id={`view-tooltip-${recipe.id}`} delayShow={0} />

            {tab === "created" ? (
                <>
                <button
                    data-tooltip-id={`save-tooltip-${recipe.id}`}
                    data-tooltip-content={isSaved ? "Unsave" : "Save"}
                    onClick={(e) => { stopPropagation(e); isSaved ? onUnsave() : onSave(); }}
                    className="my-recipes-icon-btn"
                >
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <Tooltip id={`save-tooltip-${recipe.id}`} delayShow={0} />

                <button
                    data-tooltip-id={`edit-tooltip-${recipe.id}`}
                    data-tooltip-content="Edit"
                    onClick={(e) => { stopPropagation(e); onEdit(); }}
                    className="my-recipes-icon-btn"
                >
                    <FaRegEdit />
                </button>
                <Tooltip id={`edit-tooltip-${recipe.id}`} delayShow={0} />

                <button
                    data-tooltip-id={`delete-tooltip-${recipe.id}`}
                    data-tooltip-content="Delete"
                    onClick={(e) => { stopPropagation(e); onDelete(); }}
                    className="my-recipes-icon-btn"
                >
                    <RiDeleteBin6Line />
                </button>
                <Tooltip id={`delete-tooltip-${recipe.id}`} delayShow={0} />
                </>
            ) : (
                <>
                <button
                    data-tooltip-id={`unsave-tooltip-${recipe.id}`}
                    data-tooltip-content="Unsave"
                    onClick={(e) => { stopPropagation(e); onUnsave(); }}
                    className="my-recipes-icon-btn"
                >
                    <FaBookmark />
                </button>
                <Tooltip id={`unsave-tooltip-${recipe.id}`} delayShow={0} />
                </>
            )}
            </div>
        <Tooltip id="my-recipes-tooltip" delayShow={0} />
      </div>
    </div>
  );
}