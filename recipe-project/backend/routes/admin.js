import { db } from "../firebase.js";
import express from "express";

const router = express.Router();

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

export default router;
