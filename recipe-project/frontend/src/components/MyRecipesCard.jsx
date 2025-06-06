import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import "../styles/MyRecipesCard.css";
import { Tooltip } from 'react-tooltip';
import { useNavigate } from "react-router-dom";

export default function MyRecipesCard({
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
  //Prevent card click when clicking on action buttons
  const stopPropagation = (e) => { e.stopPropagation(); };
  
  const isEdamamRecipe = recipe.type === 'edamam';
  const title = isEdamamRecipe ? recipe.label : recipe.title;
  const description = isEdamamRecipe 
    ? (Array.isArray(recipe.dishType) ? recipe.dishType.join(', ') : recipe.dishType || 'Official Edamam Recipe')
    : recipe.description;
  const imageUrl = isEdamamRecipe ? recipe.image : recipe.image;

  return (
    <div
      className="my-recipes-card"
      onClick={onView}
      style={{ cursor: "pointer" }}
    >
      <div className="my-recipes-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="recipe-card-img" />
        ) : (
          <CiImageOn className="my-recipes-image" />
        )}
      </div>
      <div className="my-recipes-content-container">
        <h3 className="my-recipes-title">{title}</h3>
        <div className="my-recipes-description-container">
          <p className="my-recipes-description">{description}</p>
        </div>
        <div className="my-recipes-actions">
          <button
            data-tooltip-id={`view-tooltip-${recipe.id || recipe.uri}`}
            data-tooltip-content="View"
            onClick={(e) => { stopPropagation(e); onView(); }}
            className="my-recipes-icon-btn"
          >
            <IoEyeOutline />
          </button>
          <Tooltip id={`view-tooltip-${recipe.id || recipe.uri}`} delayShow={0} />

          {tab === "created" ? (
            <>
              {/* <button
                data-tooltip-id={`save-tooltip-${recipe.id || recipe.uri}`}
                data-tooltip-content={isSaved ? "Unsave" : "Save"}
                onClick={(e) => { stopPropagation(e); isSaved ? onUnsave() : onSave(); }}
                className="my-recipes-icon-btn"
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <Tooltip id={`save-tooltip-${recipe.id || recipe.uri}`} delayShow={0} /> */}

              <button
                data-tooltip-id={`edit-tooltip-${recipe.id || recipe.uri}`}
                data-tooltip-content="Edit"
                onClick={(e) => { stopPropagation(e); onEdit(); }}
                className="my-recipes-icon-btn"
              >
                <FaRegEdit />
              </button>
              <Tooltip id={`edit-tooltip-${recipe.id || recipe.uri}`} delayShow={0} />

              <button
                data-tooltip-id={`delete-tooltip-${recipe.id || recipe.uri}`}
                data-tooltip-content="Delete"
                onClick={(e) => { stopPropagation(e); onDelete(); }}
                className="my-recipes-icon-btn"
              >
                <RiDeleteBin6Line />
              </button>
              <Tooltip id={`delete-tooltip-${recipe.id || recipe.uri}`} delayShow={0} />
            </>
          ) : (
            <>
              {/* <button
                data-tooltip-id={`unsave-tooltip-${recipe.id || recipe.uri}`}
                data-tooltip-content="Unsave"
                onClick={(e) => { stopPropagation(e); onUnsave(); }}
                className="my-recipes-icon-btn"
              >
                <FaBookmark />
              </button>
              <Tooltip id={`unsave-tooltip-${recipe.id || recipe.uri}`} delayShow={0} /> */}
            </>
          )}
        </div>
        <Tooltip id="my-recipes-tooltip" delayShow={0} />
      </div>
    </div>
  );
}