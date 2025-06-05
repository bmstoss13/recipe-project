import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import "../styles/RecipePage.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RecipePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recipeType, setRecipeType] = useState('edamam');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate()
    const auth = getAuth();
    const [savedRecipeIds, setSavedRecipeIds] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, [auth]);

    async function getAuthHeaders() {
        if (!user) {
            alert("You must be logged in.");
            throw new Error("Not logged in");
        }
        const token = await user.getIdToken();
        return { Authorization: `Bearer ${token}` };
    }


    useEffect(() => {
        if (!authChecked || !user) return; 
        setLoading(true);
        getAuthHeaders()
        .then(headers =>
            axios.get(`/api/recipes/${recipeType}`, { headers })
        )
        .then((res) => setRecipes(res.data))
        .catch((err) => alert(err.response?.data?.error || err.message))
        .finally(() => setLoading(false));
    }, [recipeType, user, authChecked]);


    useEffect(() => {
        if (!authChecked || !user) return;

        // Fetch list of saved recipes
        const fetchSavedRecipes = async () => {
            try {
                const headers = await getAuthHeaders();
                const response = await axios.get('/api/my-recipes/saved', { headers });
                const ids = response.data.map(recipe => recipe.id); 
                setSavedRecipeIds(ids);
            } catch (err) {
                console.error("Failed to fetch saved recipe IDs:", err);
            }
        };

        fetchSavedRecipes();
    }, [authChecked, user]);

    //Get recipes
    const fetchRecipes = async(type, query='') => {
        console.log("type: " + type);
        setLoading(true);
        setError(null);
        try{
            let url = `/api/recipes/${type}`;
            if (query) {
                url += `?q=${encodeURIComponent(query.toLowerCase())}`;
                console.log("url: " + url)
                // Object.entries(filters).forEach(([key, value]) => {
                //     url += `&<span class="math-inline">\{key\}\=</span>{encodeURIComponent(value)}`
                // });
            };
            const response = await axios.get(url);
            setRecipes(response.data);
        }
        catch(e){
            console.error(`There was an error while trying to fetch ${type} recipes: ` + e);
            setError('Failed to fetch recipes. Please try again.');
        }
        finally{
            setLoading(false);
        }
    };
    const handleSaveRecipe = async (recipeData) => {
    const { id, type } = recipeData;
    console.log('Toggling save for recipe:', id);

    try {
        const headers = await getAuthHeaders();

        if (savedRecipeIds.includes(id)) {
        //unsavign the item
        await axios.post(`/api/my-recipes/unsave/${encodeURIComponent(id)}`, null, { headers });
        setSavedRecipeIds((prev) => prev.filter((savedId) => savedId !== id));
        toast.success("Recipe unsaved.");
        } 
        else {
        //saving the item
        await axios.post(`/api/my-recipes/save`, { id, type }, { headers });
        setSavedRecipeIds((prev) => [...prev, id]);
        toast.success("Recipe saved.");
        }
    } 
    catch (err) {
        console.error("Error toggling saved state:", err);
        toast.error("Failed to update saved state.");
    }
    };


    useEffect(() => {
        fetchRecipes(recipeType, searchQuery);
    }, [recipeType, searchQuery]);

    const handleToggleChange = (event, newType) => {
        if(newType !== null){
            setRecipes([]);
            setRecipeType(newType);

        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return(
        <div className="recipe-wrapper">
            <Navbar/>
            <div className="recipe-page">
                <div className="recipe-header">
                    <h1>Recipes</h1>
                    <div className="toggle-and-search-container">
                        <div className="tab-button-container">
                            <div className="search-tabRow">
                                <div className="search-tabOuter">
                                    <button 
                                        className={`search-tabBtn${recipeType === "edamam" ? " active" : ""}`}
                                        onClick={() => setRecipeType("edamam")}
                                    >
                                        Official
                                    </button>
                                    <button 
                                        className={`search-tabBtn${recipeType === "user-generated" ? " active" : ""}`}
                                        onClick={() => setRecipeType("user-generated")}
                                    >
                                        User
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="header-search-container">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                    </div>
                </div>

                <div className="recipe-scroll-container">
                    <div className="recipe-grid">
                        {recipes && Array.isArray(recipes) && recipes.length > 0 ? (
                            recipes
                                .filter(recipe => recipeType !== 'user-generated' || recipe.published==="published")
                                .map((recipe) => (
                                <RecipeCard
                                    key={recipe.id || recipe.uri || recipe.recipe.uri}
                                    recipe={recipe}
                                    isOfficial={recipeType === 'edamam'}
                                    isSaved={savedRecipeIds.includes(recipe.uri || recipe.id || recipe.recipe?.uri)}
                                    onSaveRecipe={handleSaveRecipe} 
                                />
                            ))
                        ) : (
                            !loading && <p>No recipes found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;