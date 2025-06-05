import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/RecipeDetail.css';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { useCurrentUser } from "../components/CurrentUser";

const Comments = () => {
  const { user } = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [sortByUpvotes, setSortByUpvotes] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "comments"));
        const fetchedComments = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          data.id = docSnap.id;

          if (!data.userName && data.userId) {
            try {
              const userDoc = await getDoc(doc(db, "users", data.userId));
              data.userName = userDoc.exists() ? userDoc.data().username : "Anonymous";
            } catch {
              data.userName = "Anonymous";
            }
          } else {
            data.userName = data.userName || "Anonymous";
          }

          fetchedComments.push(data);
        }

        setComments(fetchedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, []);

  const handlePost = async () => {
    if (!user?.uid) {
      toast.error("You must be signed in to comment.");
      return;
    }

    if (!comment.trim()) {
      toast.warn('Please enter a comment.');
      return;
    }

    if (rating === 0) {
      toast.warn('Please provide a rating.');
      return;
    }

    let userName = "Anonymous";

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userName = userDoc.data().username || "Anonymous";
      }
    } catch (err) {
      console.error("Error fetching username:", err);
    }

    const newComment = {
      userId: user.uid,
      userName,
      text: comment,
      rating,
      upvotes: 0,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "comments"), newComment);
      toast.success("Thanks for your feedback!");
      setComment('');
      setRating(0);
      // Refetch comments to get accurate createdAt
      const snapshot = await getDocs(collection(db, "comments"));
      const refreshedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(refreshedComments);
    } catch (e) {
      console.error("Error posting comment:", e);
      toast.error("Error posting comment. Try again.");
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortByUpvotes) {
      return (b.upvotes || 0) - (a.upvotes || 0);
    } else {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    }
  });

  return (
    <section className="comments-wrapper">
      <section className="feedback">
        <h3>What did you think about the recipe?</h3>
        <form
          className="feedback-form"
          onSubmit={(e) => {
            e.preventDefault();
            handlePost();
          }}
        >
          <div className="feedback-input-group">
            <label>Your comment</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="feedback-input-group">
            <label>Rate this recipe</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? 'star filled' : 'star'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button
            className="post-btn"
            type="submit"
            disabled={!comment.trim() || rating === 0}
          >
            Post
          </button>
        </form>
      </section>

      <div className="comments-header">
        <h3>See what users are saying!</h3>
        <button
          className="sort-btn"
          onClick={() => setSortByUpvotes((prev) => !prev)}
        >
          Sort by: {sortByUpvotes ? "Newest" : "Most Upvoted"}
        </button>
      </div>

      {sortedComments.length === 0 ? (
        <p>No comments yet. Be the first to share your thoughts!</p>
      ) : (
        sortedComments.map((comment, index) => {
          const clampedRating = Math.max(0, Math.min(5, comment.rating || 0));

          const handleUpvote = async () => {
            if (!user?.uid) {
              toast.error("You must be signed in to upvote.");
              return;
            }

            try {
              const commentRef = doc(db, "comments", comment.id);
              const commentSnap = await getDoc(commentRef);
              const commentData = commentSnap.data();

              await updateDoc(commentRef, {
                upvotes: (commentData.upvotes || 0) + 1,
              });

              setComments((prev) =>
                prev.map((c) =>
                  c.id === comment.id
                    ? { ...c, upvotes: (c.upvotes || 0) + 1 }
                    : c
                )
              );
            } catch (err) {
              console.error("Failed to upvote:", err);
              toast.error("Could not upvote. Try again.");
            }
          };

          return (
            <div key={index} className="comment">
              <div className="comment-header">
                <strong>{comment.userName || "Anonymous"}</strong>
                <span className="comment-rating">
                  {"★".repeat(clampedRating)}
                  {"☆".repeat(5 - clampedRating)}
                </span>
              </div>
              <p>{comment.text}</p>
              <div className="comment-footer">
                <button onClick={handleUpvote} className="upvote-btn">
                  👍
                </button>
                <span className="upvote-count">{comment.upvotes || 0}</span>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

export default Comments;
