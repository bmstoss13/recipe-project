// routes/recipeDetail.js
import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const db = admin.firestore();

router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    const docRef = db.collection("userRecipes").doc(recipeId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;