import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

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
                url += `?q=${encodeURIComponent(query)}`;
                console.log("url: " + url)
                // Object.entries(filters).forEach(([key, value]) => {
                //     url += `&<span class="math-inline">\{key\}\=</span>{encodeURIComponent(value)}`
                // });
            };
            console.log("Final URL being called:", url);
            console.log("Type value:", type);
            const response = await axios.get(url);
            console.log("Response headers:", response.headers);
            console.log("Response status:", response.status);
            console.log("Response data type:", typeof response.data);
            console.log("Response data:", response.data);
            console.log("response: ", response);
            setRecipes(response.data);
            console.log("recipes: " + recipes)
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
            setRecipeType(newType);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return(
        <div>
            {/* <Navbar isAdmin={true} /> */}
            <h1>Recipes</h1>
            <ToggleButtonGroup
                value={recipeType}
                exclusive
                onChange={handleToggleChange}
                aria-label="recipe type"
            >
                <ToggleButton value="edamam" aria-label="official recipes">
                    Official Recipes
                </ToggleButton>
                <ToggleButton value="user-generated" aria-label="user recipes">
                    User Recipes
                </ToggleButton>
            </ToggleButtonGroup>

            <SearchBar onSearch={handleSearch} />
            {/* {recipeType === 'edamam' && <EdamamFilters onFilterChange={setFilters} />} */}

            {loading && <p>Loading recipes...</p>}
            {error && <p className="error-message">{error}</p>}

            <div>
                {recipes && Array.isArray(recipes) && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id || recipe.uri || recipe.recipe.uri}
                            recipe={recipe}
                            isOfficial={recipeType==='edamam'}
                            //onSaveRecipe={handleSaveRecipe}
                        />
                    ))
                ) : (
                    !loading && <p>No recipes found.</p>
                )}
            </div>
        </div>
    )
};

export default RecipePage;