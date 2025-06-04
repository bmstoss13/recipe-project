import express from 'express';
import {
  getCreatedRecipes,
  getSavedRecipes,
  deleteRecipe,
  editRecipe,
  unsaveRecipe
} from '../recipeController.js';
import admin from 'firebase-admin';
import { db } from '../firebase.js';
import authenticate from '../authenticate.js';

const router = express.Router();

// Get all recipes created by the user
router.get('/created', authenticate, async (req, res) => {
  try {
    const recipes = await getCreatedRecipes(req.user.uid);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get saved recipes for the current user
router.get('/saved', authenticate, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const savedRecipeIds = userDoc.data()?.savedRecipes || [];
    const recipesRef = db.collection('userRecipes');
    const recipes = [];
    const batchSize = 10;
    for (let i = 0; i < savedRecipeIds.length; i += batchSize) {
      const batchIds = savedRecipeIds.slice(i, i + batchSize);
      const batch = await Promise.all(
        batchIds.map(async (id) => {
          const doc = await recipesRef.doc(id).get();
          return doc.exists ? { id: doc.id, ...doc.data() } : null;
        })
      );
      recipes.push(...batch.filter(Boolean));
    }
    res.json(recipes);
  } catch (err) {
    console.error('Error in /saved route:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a created recipe
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await deleteRecipe(req.params.id, req.user.uid);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a created recipe
router.put('/:id', authenticate, async (req, res) => {
  try {
    await editRecipe(req.params.id, req.body, req.user.uid);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unsave a recipe
router.post('/unsave/:id', authenticate, async (req, res) => {
  try {
    await unsaveRecipe(req.params.id, req.user.uid);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a recipe
router.post('/save/:id', authenticate, async (req, res) => {
  try {
    await db.collection('users').doc(req.user.uid).set(
      { savedRecipes: admin.firestore.FieldValue.arrayUnion(req.params.id) },
      { merge: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;