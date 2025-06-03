import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MyRecipesCard from "../components/MyRecipesCard";
import "../styles/MyRecipesPage.css";
import { useNavigate } from "react-router-dom";

export default function MyRecipesPage() {
  const [tab, setTab] = useState("created");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate()
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // Helper to get auth headers
  async function getAuthHeaders() {
    if (!user) {
      alert("You must be logged in.");
      throw new Error("Not logged in");
    }
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  // Fetch recipes when tab or user changes
  useEffect(() => {
    if (!authChecked || !user) return; // Wait for auth to be checked
    setLoading(true);
    getAuthHeaders()
      .then(headers =>
        axios.get(`/api/my-recipes/${tab}`, { headers })
      )
      .then((res) => setRecipes(res.data))
      .catch((err) => alert(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [tab, user, authChecked]);

  // Delete a created recipe
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    const headers = await getAuthHeaders();
    await axios.delete(`/api/my-recipes/${id}`, { headers });
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Unsave a recipe
  const handleUnsave = async (id) => {
    const headers = await getAuthHeaders();
    await axios.post(`/api/my-recipes/unsave/${id}`, {}, { headers });
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Edit a recipe (navigate to edit page)
  const handleEdit = (id) => {
    window.location.href = `/edit-recipe/${id}`;
  };

  // Save a recipe (if you want to add this button somewhere)
  const handleSave = async (id) => {
    const headers = await getAuthHeaders();
    await axios.post(`/api/my-recipes/save/${id}`, {}, { headers });
    alert("Recipe saved!");
  };

  if (!authChecked) return <div>Loading...</div>;

  return (
    <div className="page">
      <h1 className="my-recipes-header">My Recipes</h1>
      <div className="tabRow">
        <div className="tabOuter">
            <button
                className={`tabBtn${tab === "created" ? " active" : ""}`}
                onClick={() => setTab("created")}
                // disabled={tab === "created"}
            >
                Created
            </button>
            <button
                className={`tabBtn${tab === "saved" ? " active" : ""}`}
                onClick={() => setTab("saved")}
                // disabled={tab === "saved"}
            >
                Saved
            </button>
        </div>
        <button
            onClick={() => (window.location.href = "/create-recipe")}
            className="createBtn"
        >
            + Create Recipe
        </button>
        </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {recipes.map((recipe) => (
            <MyRecipesCard
              key={recipe.id}
              recipe={recipe}
              tab={tab}
              onView={() => navigate(`/recipe/${recipe.id}`)}
              onEdit={() => handleEdit(recipe.id)}
              onDelete={() => handleDelete(recipe.id)}
              onSave={() => handleSave(recipe.id)}
              onUnsave={() => handleUnsave(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}