import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MyRecipesCard from '../components/MyRecipesCard';
import '../styles/MyRecipesPage.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function MyRecipesPage() {
  const [tab, setTab] = useState('created');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

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
      alert('You must be logged in.');
      throw new Error('Not logged in');
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
      .then(async (res) => {
        if (tab === 'saved') {
          // For saved recipes, need to fetch Edamam recipe details for Edamam URIs
          const edamamRecipes = res.data.filter(recipe => recipe.type === 'edamam');
          const userRecipes = res.data.filter(recipe => recipe.type !== 'edamam');
          
          if (edamamRecipes.length > 0) {
            // Fetch Edamam recipe details
            const edamamPromises = edamamRecipes.map(recipe => 
              axios.get(`/api/recipes/edamam/${encodeURIComponent(recipe.uri)}`)
            );
            
            try {
              const edamamResponses = await Promise.all(edamamPromises);
              const edamamDetails = edamamResponses.map(response => ({
                ...response.data,
                type: 'edamam',
                uri: response.data.uri
              }));
              setRecipes([...userRecipes, ...edamamDetails]);
            } catch (err) {
              console.error('Error fetching Edamam recipes:', err);
              setRecipes(userRecipes); // Fallback to just user recipes if Edamam fetch fails
            }
          } else {
            setRecipes(userRecipes);
          }
        } else {
          setRecipes(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        alert(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [tab, user, authChecked]);

  // Delete a created recipe
  const handleDelete = async (id) => {
    const headers = await getAuthHeaders();
    await axios.delete(`/api/my-recipes/${id}`, { headers });
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    toast.success("Recipe deleted!");
  };

  // Unsave a recipe
  const handleUnsave = async (id) => {
    const headers = await getAuthHeaders();
    await axios.post(`/api/my-recipes/unsave/${encodeURIComponent(id)}`, {}, { headers });
    if (tab === "saved") {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
    setSavedRecipeIds((prev) => prev.filter((recipeId) => recipeId !== id));
    toast.success("Recipe unsaved!");
  };

  // Edit a recipe (navigate to edit page)
  const handleEdit = (id) => {
    navigate(`/edit-recipe/${id}`);
  };

  // Get saved recipes 
  useEffect(() => {
    if (!user) return;
    getAuthHeaders()
      .then(headers => 
        axios.get('/api/my-recipes/saved', { headers })
      )
      .then(res => {
        setSavedRecipeIds(res.data.map(recipe => recipe.id));
      })
      .catch(err => console.error('Error fetching saved recipes:', err));
  }, [user]);

  // Save a recipe
  const handleSave = async (id) => {
    const headers = await getAuthHeaders();
    await axios.post(`/api/my-recipes/save/${id}`, {}, { headers });
    setSavedRecipeIds((prev) => [...prev, id]);
    toast.success("Recipe saved!");
  };

  if (!authChecked) return <div>Loading...</div>;

  return (
    <div className="recipe-wrapper">
      <Navbar />
      <div className="my-recipes-main-content">
        <h1 className="my-recipes-header">My Recipes</h1>
        <div className="tabRow">
          <div className="tabOuter">
              <button
                  className={`tabBtn${tab === "created" ? " active" : ""}`}
                  onClick={() => setTab("created")}
              >
                  Created
              </button>
              <button
                  className={`tabBtn${tab === "saved" ? " active" : ""}`}
                  onClick={() => setTab("saved")}
              >
                  Saved
              </button>
          </div>
          <button
              onClick={() => navigate("/create-recipe")}
              className="createBtn"
          >
              + Create Recipe
          </button>
        </div>
        {loading ? (
          <p>Loading your recipes...</p>
        ) : (
          <div className="grid">
            {recipes.length === 0 ? (
              <p style={{ width: '100%' }}>
                {tab === 'saved'
                  ? 'Start saving recipes to view them here!'
                  : 'No recipes created yet.'}
              </p>
            ) : (
              recipes.map((recipe) => (
                <MyRecipesCard
                  key={recipe.id || recipe.uri}
                  recipe={recipe}
                  tab={tab}
                  onView={() => navigate(recipe.type === 'edamam' ? `/edamam-recipeDetail/${encodeURIComponent(recipe.uri)}` : `/recipeDetail/${recipe.id}`)}
                  onEdit={() => handleEdit(recipe.id)}
                  onDelete={() => {
                    setRecipeToDelete(recipe.id);
                    setOpenDeleteDialog(true);
                  }}
                  onSave={() => handleSave(recipe.id)}
                  onUnsave={() => handleUnsave(recipe.id)}
                  isSaved={savedRecipeIds.includes(recipe.id || recipe.uri)}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* Material UI Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleDelete(recipeToDelete);
              setOpenDeleteDialog(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}