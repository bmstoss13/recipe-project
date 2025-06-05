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
import axios from 'axios';

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
    
    // Separate Edamam URIs from user-generated recipe IDs
    const edamamUris = savedRecipeIds.filter(id => id.includes('edamam.owl'));
    const userRecipeIds = savedRecipeIds.filter(id => !id.includes('edamam.owl'));
    
    const recipes = [];

    // Fetch user-generated recipes
    if (userRecipeIds.length > 0) {
      const recipesRef = db.collection('userRecipes');
      const batchSize = 10;
      for (let i = 0; i < userRecipeIds.length; i += batchSize) {
        const batchIds = userRecipeIds.slice(i, i + batchSize);
        const batch = await Promise.all(
          batchIds.map(async (id) => {
            const doc = await recipesRef.doc(id).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
          })
        );
        recipes.push(...batch.filter(Boolean));
      }
    }

    // Add Edamam recipes
    for (const uri of edamamUris) {
      recipes.push({
        id: uri,
        type: 'edamam',
        uri: uri
      });
    }

    res.json(recipes);
  } 
  catch (err) {
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
router.post('/save', authenticate, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    await db.collection('users').doc(req.user.uid).set(
      { savedRecipes: admin.firestore.FieldValue.arrayUnion(id) },
      { merge: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;