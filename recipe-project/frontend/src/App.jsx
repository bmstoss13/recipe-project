import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';
import RecipePage from './routes/RecipePage';
import Navbar from './components/Navbar'; 
import { ToastContainer } from 'react-toastify';
import './App.css'; 

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
              <Route path="/guest" element={<GuestPage />} />
              <Route path="/recipes" element={<RecipePage />} />
              {/* <Route path="/recipes/:id" element={<RecipeDetail />} /> */}
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;