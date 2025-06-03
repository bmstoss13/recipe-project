import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function MyRecipesPage() {
  const [tab, setTab] = useState("created");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

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
    if (!authChecked) return; // Wait for auth to be checked
    if (!user) return; // Don't fetch if not logged in
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
                  <button onClick={() => handleSave(recipe.id)}>Save</button>
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