import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import CreateRecipe from './routes/CreateRecipe'
import RecipePage from './routes/RecipePage';

import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import './App.css'; 

import LoginSignup from './routes/LoginSignup';
import RecipeDetail from './routes/RecipeDetail';


function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);


  const toggleNavbar = () => {
    setIsNavbarOpen(prevOpen => !prevOpen);
  };

  return (
    <>
      <Router>
        <div className="app-container">
          <Navbar isOpen={isNavbarOpen} onToggle={toggleNavbar} />

          <div className={`content-area ${isNavbarOpen ? 'navbar-open' : 'navbar-closed'}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/recipes" element={<RecipePage />} />
              <Route path="/auth" element={<LoginSignup />} />
              <Route path="/recipeDetail" element={<RecipeDetail />} />
              {/* <Route path="/recipes/:id" element={<RecipeDetail />} /> *Placeholder */}
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;