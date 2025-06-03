import db from "../firebase.js";
import express from "express";

const router = express.Router();

router.post("/recipe", async (req, res) => {
  try {
    const {
      user_id,
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
      title: title,
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

export default router;
