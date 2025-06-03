import React from 'react';
import { useState } from 'react';
import '../styles/RecipeDetail.css';
import ChatAssistant from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  {/*PLACEHOLDER*/}
  const [comments, setComments] = useState([
    { name: 'Alice', text: 'Loved this recipe! Easy to follow and tasty.', rating: 5 },
    { name: 'Bob', text: 'Turned out great, might add more garlic next time.', rating: 4 },
  ]);
  const recipe = {
    title: "Delicious Spaghetti Carbonara",
    description: "A classic Italian pasta dish with a creamy sauce.",
    image: 'https://www.budgetbytes.com/wp-content/uploads/2016/05/Spaghetti-Carbonara-Plated.jpg',
    steps: [
      "Cook spaghetti in salted water until al dente.",
      "In a bowl, mix eggs and grated Pecorino cheese.",
      "Fry guanciale until crispy.",
      "Combine cooked spaghetti, egg mixture, and guanciale."
    ]
  };

  const handlePost = () => {
    if (!comment && !rating) return alert('Please enter a comment or rating.');
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    alert('Thanks for your feedback!');
    setComment('');
    setRating(0);
  };

  return (
    <div className="recipe-detail-container">
        <span onClick={() => navigate(-1)} className="recipeback-text">← Back</span>
        <div className="recipe-detail">
        <div className="recipe-header">
            <div className="recipe-text">
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <div className="recipe-buttons">
                <button className="outline">Share</button>
                <button className="solid">Save Recipe</button>
            </div>
            </div>
            <div className="recipe-image">
                <img src={recipe.image} alt="Recipe" className="recipe-image-bordered" />
            </div>
        </div>

        <section className="instructions">
            <h2>Instructions</h2>
            <p>Step-by-step guide to prepare the dish.</p>
            <ul>
            {recipe.steps.map((step, index) => (
                <li key={index}>
                <div className="step-box">
                    <div className="step-text">
                    <strong>Step {index + 1}</strong>
                    <p>{step}</p>
                    </div>
                </div>
                </li>
            ))}
            </ul>
            <h2 className="serveInst">Serve and Enjoy!</h2>
        </section>

        <section className="feedback">
            <h3>What did you think about the recipe?</h3>

            <label>Your comment</label>
            <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

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

            <button className="post-btn" onClick={handlePost}>
                Post
            </button>
            </section>

        <section className="comments-section">
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
      </div>

      <div className="chat-button" onClick={() => alert("AI Assistant coming soon!")}>
        💬 Need help?
      </div>
      <ChatAssistant />
    </div>
  );
};

export default RecipeDetail;
