import express from 'express';
import { auth, db } from '../firebase.js'; 

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { uid, email, displayName } = req.body;

  try {
    if (!uid || !email || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.collection('users').doc(uid).set({
      uid,
      email,
      username: displayName,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'User added to Firestore successfully',
      uid,
      email,
    });
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
