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

// Get all recipes saved by the user
router.get('/saved', authenticate, async (req, res) => {
  try {
    const recipes = await getSavedRecipes(req.user.uid);
    res.json(recipes);
  } catch (err) {
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