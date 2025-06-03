import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRecipesPage() {
  const [tab, setTab] = useState("created"); // "created" or "saved"
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recipes when tab changes
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/my-recipes/${tab}`)
      .then((res) => setRecipes(res.data))
      .catch((err) => alert(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [tab]);

  // Delete a created recipe
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await axios.delete(`/api/my-recipes/${id}`);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Unsave a recipe
  const handleUnsave = async (id) => {
    await axios.post(`/api/my-recipes/unsave/${id}`);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Edit a recipe (navigate to edit page)
  const handleEdit = (id) => {
    // Use your router here, e.g.:
    window.location.href = `/edit-recipe/${id}`;
  };

  // Save a recipe (if you want to add this button somewhere)
  const handleSave = async (id) => {
    await axios.post(`/api/my-recipes/save/${id}`);
    alert("Recipe saved!");
  };

  return (
    <div>
      <h1>My Recipes</h1>
      <div>
        <button onClick={() => setTab("created")} disabled={tab === "created"}>
          Created
        </button>
        <button onClick={() => setTab("saved")} disabled={tab === "saved"}>
          Saved
        </button>
      </div>
      <button onClick={() => (window.location.href = "/create-recipe")}>+ Create Recipe</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                width: "250px",
              }}
            >
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <ul>
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <button onClick={() => window.location.href = `/recipe/${recipe.id}`}>
                View
              </button>
              {tab === "created" ? (
                <>
                  <button onClick={() => handleEdit(recipe.id)}>Edit</button>
                  <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                </>
              ) : (
                <button onClick={() => handleUnsave(recipe.id)}>Unsave</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 