import React from 'react';
import { useState } from 'react';
import '../styles/RecipeDetail.css';
import ChatAssistant from '../components/ChatBot';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';

const RecipeDetail = () => {
  const navigate = useNavigate();

  {/*PLACEHOLDER*/}
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

        <Comments />
    </div>

      <div className="chat-button" onClick={() => alert("AI Assistant coming soon!")}>
        💬 Need help?
      </div>
      <ChatAssistant />
    </div>
  );
};

export default RecipeDetail;
