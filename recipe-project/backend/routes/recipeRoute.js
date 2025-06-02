import db from "../firebase.js";
import axios from "axios";
import express from "express";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();


const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_API_URL = 'https://api.edamam.com/api/recipes/v2';

//route for /api/recipes/edamam to return recipes with given params
router.get('/edamam', async(req, res) => {
    try{
        const { q, diet, cuisineType, mealType, dishType, health } = req.query; //potential to expand later, but want to start with the basics.
        let params = {
            type: 'public',
            app_id: EDAMAM_APP_ID,
            app_key: EDAMAM_APP_KEY,
        };

        if(q){
            params.q = q;
        }
        else{
            params.q = ('Random Recipe');
        };

        if(diet) params.diet = diet;
        if(cuisineType) params.cuisineType = cuisineType;
        if(mealType) params.mealType = mealType;
        if(dishType) params.dishType = dishType;
        if(health) params.health = health;

        const response = await axios.get(EDAMAM_API_URL, { 
            params, 
            headers:{
                'Edamam-Account-User': EDAMAM_APP_ID //attach the account user id to the url for authorization.
            }});
        res.json(response.data.hits);
        
    }
    catch(e){
        console.error("There was an error trying to fetch Edamam recipes: " + e.message);
        if(e.response){
            console.error('Edamam API Error Response: ' + e.response.data);
            res.status(e.response.status).json({ message: e.response.data.message || "There was an error fetching recipes from Edamam" });
        }
        else{
            res.status(500).json("Error getting recipes from Edamam: " + e);
        };
    };
});

//route for /api/recipes/user-generated in order to get the user-generated recipes 
router.get('/user-generated', async(req, res) => {
    try{
        const { query } = req.query;
        let recipesRef = db.collection('userRecipes');
        let snapshot;

        if(query){
            snapshot = await recipesRef.where('title', '>=', query).where('title', '<=', query + '\uf8ff').get();

        }
        else{
            snapshot = await recipesRef.get();
        }
        const recipes = [];
        snapshot.forEach(doc => {
            recipes.push({ id: doc.id, ...doc.data() });
        });

        res.json(recipes);

    }
    catch(e){
        console.error("There was an error fetching user-generated recipes: " + e);
        res.status(500).json({ message: 'Server error fetching user-generated recipes' });
    };
})

export default router;