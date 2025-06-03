import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import RecipePage from './routes/RecipePage';
import LoginSignup from './routes/LoginSignup';
import RecipeDetail from './routes/RecipeDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/recipeDetail" element={<RecipeDetail />} />
        {/* <Route path="/recipes/:id" element={<RecipeDetail />} /> *Placeholder */}
      </Routes>
    </Router>
  );
}

export default App;
