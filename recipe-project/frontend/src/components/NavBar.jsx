
import React, { useState, useEffect } from 'react';

import '../styles/Navbar.css';
import { FaUserCircle, FaSearch, FaBookOpen, FaPlus, FaSignInAlt, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';



const Navbar = ({ isAdmin = false, onToggle }) => {
  const [open, setOpen] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guest = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guest);
  }, []);

  const handleAuthClick = () => {
    localStorage.removeItem('isGuest');
    window.location.href = isGuest ? '/auth' : '/';
  };


  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="top-section">

        <div className={`toggle-container ${isOpen ? 'open' : 'closed'}`}>
          <button className="toggle-btn" onClick={onToggle}>

            <FaBars />
          </button>
        </div>

        <div className="profile">
          <FaUserCircle className={`profile-icon ${isOpen ? 'expanded' : 'collapsed'}`} />
          {isOpen && <p className="username">{isGuest ? 'Guest' : 'Username'}</p>}
        </div>

        <hr />

        <nav className="nav-links">
          <a href="#"><FaSearch /> {isOpen && 'Browse Recipes'}</a>
          <a href="#"><FaBookOpen /> {isOpen && 'My Recipes'}</a>
          <a href="#"><FaPlus /> {isOpen && 'Add Recipe'}</a>
          {isAdmin && (
            <a href="#"><MdDashboard /> {isOpen && 'Admin Dashboard'}</a>
          )}
          <a href="/recipeDetail">{open && 'TEMP - recipe detail'}</a>
        </nav>
      </div>

      <div className="logout-btn">

        <a href="#" onClick={handleAuthClick}>
          {open && (isGuest ? 'Sign In' : 'Logout')}
        </a>

      </div>
    </div>
  );
};

export default Navbar;