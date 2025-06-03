import { db } from './firebase.js';
import admin from 'firebase-admin';

//Get all recipes created by the hardcoded user.
export async function getCreatedRecipes(userId) {
    const snapshot = await db.collection('userRecipes').where('user_id', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }


 // Get all recipes saved by the user.
export async function getSavedRecipes(userId) {
  const userDoc = await db.collection('users').doc(userId).get();
  const savedRecipes = userDoc.data()?.savedRecipes || [];
  if (savedRecipes.length === 0) return [];

  // Firestore 'in' queries are limited to 10 items at a time
  const chunks = [];
  for (let i = 0; i < savedRecipes.length; i += 10) {
    chunks.push(savedRecipes.slice(i, i + 10));
  }

  let recipes = [];
  for (const chunk of chunks) {
    const snapshot = await db.collection('userRecipes').where(
      admin.firestore.FieldPath.documentId(), 'in', chunk
    ).get();
    recipes = recipes.concat(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  return recipes;
}

// Delete a recipe by its ID (only if the user is the owner)
export async function deleteRecipe(recipeId, userId) {
    const doc = await db.collection('userRecipes').doc(recipeId).get();
    if (doc.exists && doc.data().user_id === userId) {
      await db.collection('userRecipes').doc(recipeId).delete();
    } else {
      throw new Error('Unauthorized: You do not own this recipe.');
    }
  }

// Edit a recipe by its ID (only if the user is the owner)
export async function editRecipe(recipeId, updatedData, userId) {
    const doc = await db.collection('userRecipes').doc(recipeId).get();
    if (doc.exists && doc.data().user_id === userId) {
      await db.collection('userRecipes').doc(recipeId).update(updatedData);
    } else {
      throw new Error('Unauthorized: You do not own this recipe.');
    }
  }

// Unsave a recipe (only if the recipe is in the user's savedRecipes array)
export async function unsaveRecipe(recipeId, userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    const savedRecipes = userDoc.data()?.savedRecipes || [];
    if (savedRecipes.includes(recipeId)) {
      await db.collection('users').doc(userId).update({
        savedRecipes: admin.firestore.FieldValue.arrayRemove(recipeId)
      });
    } else {
      throw new Error('Unauthorized: Recipe not in your saved list.');
    }
  }