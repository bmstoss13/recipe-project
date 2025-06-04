import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import CreateRecipe from './routes/CreateRecipe'
import EditRecipe from './routes/EditRecipe'
import RecipePage from './routes/RecipePage';

import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
// import './App.css'; 

import LoginSignup from './routes/LoginSignup';
import RecipeDetail from './routes/RecipeDetail';


function App() {
  return (
    <>
      <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/edit-recipe/:id" element={<EditRecipe />} />
              <Route path="/recipes" element={<RecipePage />} />
              {/* <Route path="/recipes/:id" element={<RecipePage />} /> PLACE HOLDER FOR VIEWING SPECIFIC RECIPE*/}
              <Route path="/auth" element={<LoginSignup />} />
              <Route path="/recipeDetail" element={<RecipeDetail />} />
            </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;