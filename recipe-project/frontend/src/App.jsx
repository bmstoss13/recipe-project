import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import RecipePage from './routes/RecipePage';
import LoginSignup from './routes/LoginSignup';
import MyRecipesPage from './routes/MyRecipesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/my-recipes" element={<MyRecipesPage />} />
        // {/* <Route path="/recipes/:id" element={<RecipeDetail />} /> *Placeholder */}
      </Routes>
    </Router>
  );
}

export default App;
