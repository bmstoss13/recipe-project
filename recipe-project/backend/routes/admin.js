import { db } from "../firebase.js";
import express from "express";

const router = express.Router();

router.get("/get/pending", async (req, res) => {
  try {
    const recipesQuery = db
      .collection("userRecipes")
      .where("published", "==", "pending");
    const querySnapshot = await recipesQuery.get();

    const pendingRecipes = [];
    querySnapshot.forEach((doc) => {
      pendingRecipes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(pendingRecipes);
  } catch (e) {
    console.error("Unable to retrieve pending recipes: ", e);
    res.status(500).json({
      message: "Unable to retrieve pending recipes: ",
      error: e.message,
    });
  }
});

router.get("/get/published", async (req, res) => {
  try {
    const recipesQuery = db
      .collection("userRecipes")
      .where("published", "==", "published");
    const querySnapshot = await recipesQuery.get();

    const pendingRecipes = [];
    querySnapshot.forEach((doc) => {
      pendingRecipes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(pendingRecipes);
  } catch (e) {
    console.error("Unable to retrieve pending recipes: ", e);
    res.status(500).json({
      message: "Unable to retrieve pending recipes: ",
      error: e.message,
    });
  }
});

router.get("/get/rejected", async (req, res) => {
  try {
    const recipesQuery = db
      .collection("userRecipes")
      .where("published", "==", "rejected");
    const querySnapshot = await recipesQuery.get();

    const pendingRecipes = [];
    querySnapshot.forEach((doc) => {
      pendingRecipes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(pendingRecipes);
  } catch (e) {
    console.error("Unable to retrieve pending recipes: ", e);
    res.status(500).json({
      message: "Unable to retrieve pending recipes: ",
      error: e.message,
    });
  }
});

router.put("/publish/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const recipeRef = db.collection("userRecipes").doc(recipeId);

    const recipeSnap = await recipeRef.get();
    if (!recipeSnap.exists) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    await recipeRef.update({
      published: "published",
    });

    res.status(200).json({
      message: `Recipe ${recipeId} successfully published!`,
      recipeId: recipeId,
      newStatus: "published",
    });
  } catch (e) {
    console.error(`Unable to publish recipe ${recipeId}: `, e);
    res.status(500).json({
      message: `Unable to publish recipe ${recipeId}: `,
      error: e.message,
    });
  }
});

router.put("/reject/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const recipeRef = db.collection("userRecipes").doc(recipeId);

    const recipeSnap = await recipeRef.get();
    if (!recipeSnap.exists) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    await recipeRef.update({
      published: "rejected",
    });

    res.status(200).json({
      message: `Recipe ${recipeId} successfully rejected!`,
      recipeId: recipeId,
      newStatus: "published",
    });
  } catch (e) {
    console.error(`Unable to reject recipe ${recipeId}: `, e);
    res.status(500).json({
      message: `Unable to reject recipe ${recipeId}: `,
      error: e.message,
    });
  }
});

export default router;
