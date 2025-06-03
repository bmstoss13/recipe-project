import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Comments = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([
    { name: 'Alice', text: 'Loved this recipe! Easy to follow and tasty.', rating: 5 },
    { name: 'Bob', text: 'Turned out great, might add more garlic next time.', rating: 4 },
  ]);

  const handlePost = () => {    
    if (!comment && !rating) {
        toast.warn('Please enter a comment or rating.');
        return;
    }
    const newComment = {
      name: 'You',
      text: comment,
      rating: rating,
    };

    setComments([newComment, ...comments]);
    setComment('');
    setRating(0);
    alert('Thanks for your feedback!');
  };

  return (
    <section className="comments-wrapper">
        <section className="feedback">
        <h3>What did you think about the recipe?</h3>

        <form className="feedback-form" onSubmit={(e) => {
            e.preventDefault();
            handlePost();
        }}>
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

            <button className="post-btn" type="submit">Post</button>
        </form>
        </section>

      <h3>See what users are saying!</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to share your thoughts!</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-header">
              <strong>{comment.name || 'Anonymous'}</strong>
              <span className="comment-rating">
                {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
              </span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))
      )}
    </section>
  );
};

export default Comments;
