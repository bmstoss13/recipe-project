import { db } from "../firebase.js";
import express from "express";

const router = express.Router();

router.post("/recipe", async (req, res) => {
  try {
    const {
      user_id,
      username,
      title,
      description,
      prep_time,
      cook_time,
      servings,
      ingredients,
      instructions,
    } = req.body;

    const newRecipe = {
      user_id: user_id,
      username: username,
      title: title,
      titleLower: title.toLowerCase(),
      description: description,
      prep_time: prep_time,
      cook_time: cook_time,
      servings: servings,
      ingredients: ingredients,
      instructions: instructions,
      published: "pending",
      upvotes: [],
    };

    const docRef = await db.collection("userRecipes").add(newRecipe);

    res.status(200).json({
      recipeId: docRef.id,
      recipe: newRecipe,
    });
  } catch (e) {
    console.error("Unable to create recipe: ", e);
    res.send(500).json({ message: "Unable to create recipe: ", e });
  }
});

router.put("/edit", async (req, res) => {
  try {
    const {
      recipe_id,
      title,
      description,
      prep_time,
      cook_time,
      servings,
      ingredients,
      instructions,
    } = req.body;

    const updatedRecipeData = {
      title: title,
      titleLower: title.toLowerCase(),
      description: description,
      prep_time: prep_time,
      cook_time: cook_time,
      servings: servings,
      ingredients: ingredients,
      instructions: instructions,
    };

    const recipeRef = db.collection("userRecipes").doc(recipe_id);
    await recipeRef.update(updatedRecipeData);

    res.status(200).json({
      recipeId: recipe_id,
      updatedFields: updatedRecipeData,
    });
  } catch (e) {
    console.error("Unable to update recipe: ", e);
    res
      .status(500)
      .json({ message: "Unable to update recipe: ", error: e.message });
  }
});

router.get("/get/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipeRef = db.collection("userRecipes").doc(recipeId);
    const recipeSnap = await recipeRef.get();

    if (recipeSnap.exists) {
      res.status(200).json({
        id: recipeSnap.id,
        ...recipeSnap.data(),
      });
    } else {
      res.status(404).json({ message: "Recipe not found." });
    }
  } catch (e) {
    console.error("Unable to retrieve recipe: ", e);
    res
      .status(500)
      .json({ message: "Unable to retrieve recipe: ", error: e.message });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      res.status(200).json({
        id: userSnap.id,
        ...userSnap.data(),
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (e) {
    console.error("Unable to retrieve user: ", e);
    res
      .status(500)
      .json({ message: "Unable to retrieve user: ", error: e.message });
  }
});

export default router;
