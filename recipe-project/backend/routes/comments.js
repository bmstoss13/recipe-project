import express from "express";
import { db } from "../firebase.js";

const router = express.Router();
const commentsRef = db.collection("comments");

router.get("/", async (req, res) => {
  try {
    const snapshot = await commentsRef.get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (e) {
    console.error("Error fetching comments:", e);
    res.status(500).json({ message: "Server error fetching comments" });
  }
});

router.post("/", async (req, res) => {
  const { rating, text, upvotes, userId } = req.body;

  if (
    typeof rating !== "number" ||
    typeof text !== "string" ||
    typeof upvotes !== "number" ||
    typeof userId !== "string"
  ) {
    return res.status(400).json({ message: "Invalid input types" });
  }

  try {
    const newComment = {
      rating,
      text,
      upvotes,
      userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await commentsRef.add(newComment);
    res.status(201).json({ id: docRef.id, ...newComment });
  } catch (e) {
    console.error("Error adding comment:", e);
    res.status(500).json({ message: "Server error posting comment" });
  }
});

export default router;
