import express from 'express';
import { auth } from '../firebase.js'; 

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
