import React from 'react';
import '../styles/HomePage.css';
import backgroundImage from '../assets/background.jpg';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <div className="home-content">
          <h1>What's for Dinner?</h1>
          <p>Never ask again.</p>
          <div className="home-buttons">
            <Link to="/auth?mode=login">Login</Link>
            <Link to="/auth?mode=signup">Sign Up</Link>
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem('isGuest', 'true');
                window.location.href = '/home'; 
              }}
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
