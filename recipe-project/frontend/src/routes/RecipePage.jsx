import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import "../styles/RecipePage.css";

//Establish the recipes page, which gives user the option to switch between edamam and user-generated recipes to choose from
const RecipePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recipeType, setRecipeType] = useState('edamam');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});

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
                        <ToggleButtonGroup
                            value={recipeType}
                            exclusive
                            onChange={handleToggleChange}
                            aria-label="recipe type"
                        >
                            <ToggleButton value="edamam" aria-label="official recipes">
                                Official
                            </ToggleButton>
                            <ToggleButton value="user-generated" aria-label="user recipes">
                                User 
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <div className="header-search-container">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                    </div>
                </div>


                <div className="recipe-scroll-container">
                    <div className="recipe-grid">
                        {recipes && Array.isArray(recipes) && recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id || recipe.uri || recipe.recipe.uri}
                                    recipe={recipe}
                                    isOfficial={recipeType === 'edamam'}
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