import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import CreateRecipe from './routes/CreateRecipe'
import EditRecipe from './routes/EditRecipe'
import AdminDashboard from './routes/AdminDashboard'
import RecipePage from './routes/RecipePage';
import MyRecipesPage from './routes/MyRecipesPage';
import EdamamRecipeDetail from './routes/EdamamRecipeDetail';

import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { UserProvider } from './components/CurrentUser';
// import './App.css'; 

import LoginSignup from './routes/LoginSignup';
import RecipeDetail from './routes/RecipeDetail';


function App() {
  return (
    <>
      <Router>
        <UserProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/edit-recipe/:id" element={<EditRecipe />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/recipes" element={<RecipePage />} />
              <Route path="/auth" element={<LoginSignup />} />
              <Route path="/recipeDetail/:id" element={<RecipeDetail />} />
              <Route path="/my-recipes" element={<MyRecipesPage />} />
              <Route path="/edamam-recipeDetail/:id" element={< EdamamRecipeDetail/>} />
            </Routes>
          </UserProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;