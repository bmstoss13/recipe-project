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
            <Link to="/guest">Login</Link>
            <Link to="/guest">Sign up</Link>
            <Link to="/guest">Continue as guest</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
