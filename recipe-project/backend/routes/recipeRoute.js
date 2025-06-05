import { db } from "../firebase.js";
import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import authenticate from "../authenticate.js";

const router = express.Router();
dotenv.config();

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_API_URL = "https://api.edamam.com/api/recipes/v2";

//route for /api/recipes/edamam to return recipes with given params
router.get("/edamam", async (req, res) => {
  try {
    const { q, diet, cuisineType, mealType, dishType, health } = req.query; //potential to expand later, but want to start with the basics.
    let params = {
      type: "public",
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
    };

    if (q) {
      params.q = q;
    } else {
      params.q = "Random Recipe";
    }

    if (diet) params.diet = diet;
    if (cuisineType) params.cuisineType = cuisineType;
    if (mealType) params.mealType = mealType;
    if (dishType) params.dishType = dishType;
    if (health) params.health = health;

    const response = await axios.get(EDAMAM_API_URL, {
      params,
      headers: {
        "Edamam-Account-User": EDAMAM_APP_ID, //attach the account user id to the url for authorization.
      },
    });
    res.json(response.data.hits);
  } catch (e) {
    console.error(
      "There was an error trying to fetch Edamam recipes: " + e.message
    );
    if (e.response) {
      console.error("Edamam API Error Response: " + e.response.data);
      res.status(e.response.status).json({
        message:
          e.response.data.message ||
          "There was an error fetching recipes from Edamam",
      });
    } else {
      res.status(500).json("Error getting recipes from Edamam: " + e);
    }
  }
});

router.get("/user-generated", async (req, res) => {
  try {
    const { query } = req.query;
    let recipesRef = db.collection("userRecipes");
    let snapshot;

    if (query) {
      snapshot = await recipesRef
        .where("title", ">=", query)
        .where("title", "<=", query + "\uf8ff")
        .get();
    } else {
      snapshot = await recipesRef.get();
    }
    const recipes = [];
    snapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });

    res.json(recipes);
  } catch (e) {
    console.error("There was an error fetching user-generated recipes: " + e);
    res
      .status(500)
      .json({ message: "Server error fetching user-generated recipes" });
  }
});

router.get("/edamam/:encodedUri", async (req, res) => {
  try {
    const decodedUri = decodeURIComponent(req.params.encodedUri);
    console.log("Edamam recipe for URI: " + decodedUri);

    if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
      return res.status(500).json({
        error: "Edamam API credentials are not configured correctly.",
      });
    }
    const edamamApiUrl = `https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodeURIComponent(
      decodedUri
    )}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

    const apiResponse = await axios.get(edamamApiUrl, {
      headers: {
        "Edamam-Account-User": EDAMAM_APP_ID,
      },
    });

    console.log("Edamam API raw response status:", apiResponse.status);
    console.log(
      "Edamam API raw response data structure:",
      JSON.stringify(apiResponse.data, null, 2)
    );

    let recipeData = null;

    if (
      apiResponse.data.hits &&
      Array.isArray(apiResponse.data.hits) &&
      apiResponse.data.hits.length > 0
    ) {
      recipeData = apiResponse.data.hits[0].recipe;
      console.log("DEBUG: Extracted recipe from 'hits[0].recipe'");
    }

    if (recipeData) {
      res.json(recipeData);
    } else {
      console.warn(
        "Edamam API returned 200 OK, but no valid recipe data found in expected structure for URI:",
        decodedUri
      );
      res
        .status(404)
        .json({ error: "Edamam recipe not found for the provided URI." });
    }
  } catch (e) {
    console.error("Error retrieving Edamam recipe: " + e.message);
    if (e.response) {
      console.error("Edamam API Error Response Status:", e.response.status);
      console.error(
        "Edamam API Error Response Data:",
        JSON.stringify(e.response.data, null, 2)
      );
    }
    res
      .status(e.response.status || 500)
      .json({ error: e.message || "Failed to fetch Edamam recipe." });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipeDoc = await db.collection("userRecipes").doc(recipeId).get();

    if (!recipeDoc.exists) {
      return res.status(404).json({ error: "User recipe not found." });
    }

    res.json({ id: recipeDoc.id, ...recipeDoc.data() });
  } catch (e) {
    console.error("Error fetching user recipe:", e);
    res
      .status(500)
      .json({ error: e.message || "Failed to fetch user recipe details." });
  }
});

router.put("/saveRecipe", async (req, res) => {
  try {
    const { id, savedRecipes } = req.body;

    const updatedUserData = {
      savedRecipes: savedRecipes,
    };

    const userRef = db.collection("users").doc(id);
    await userRef.update(updatedUserData);

    res.status(200).json({
      userId: id,
      updatedFields: updatedUserData,
    });
  } catch (e) {
    console.error("Unable to update user: ", e);
    res
      .status(500)
      .json({ message: "Unable to update user: ", error: e.message });
  }
});

export default router;
