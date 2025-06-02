import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
console.log("APP ID:", import.meta.env.VITE_EDAMAM_APP_ID);
console.log("APP KEY:", import.meta.env.VITE_EDAMAM_APP_KEY);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${import.meta.env.VITE_EDAMAM_APP_ID}&app_key=${import.meta.env.VITE_EDAMAM_APP_KEY}`
        );
        setRecipe(response.data.recipe);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{recipe.label}</h1>
      <img
        src={recipe.image}
        alt={recipe.label}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
      />
      <p><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
      <p><strong>Source:</strong> <a href={recipe.url} target="_blank" rel="noopener noreferrer">View Full Recipe</a></p>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredientLines.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>Nutrition Facts</h2>
      <ul>
        {Object.entries(recipe.totalNutrients).map(([key, value]) => (
          <li key={key}>
            {value.label}: {Math.round(value.quantity)} {value.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
