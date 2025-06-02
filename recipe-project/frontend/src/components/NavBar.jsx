import React, { useState } from 'react';
import '../styles/Navbar.css';
import { FaUserCircle, FaSearch, FaBookOpen, FaPlus, FaSignInAlt, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Navbar = ({ isAdmin = false, isGuest = false }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="top-section">
        <div className={`toggle-container ${open ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={() => setOpen(!open)}>
                <FaBars />
            </button>
        </div>

        <div className="profile">
          <FaUserCircle className={`profile-icon ${open ? 'expanded' : 'collapsed'}`} />
          {open && <p className="username">{isGuest ? 'Guest' : 'Username'}</p>}
        </div>

        <hr></hr>

        <nav className="nav-links">
          <a href="#"><FaSearch /> {open && 'Browse Recipes'}</a>
          <a href="#"><FaBookOpen /> {open && 'My Recipes'}</a>
          <a href="#"><FaPlus /> {open && 'Add Recipe'}</a>
          {isAdmin && (
            <a href="#"><MdDashboard /> {open && 'Admin Dashboard'}</a>
          )}
        </nav>
      </div>

      <div className="logout-btn">
        <a href="#"><FaSignInAlt /> {open && (isGuest ? 'Sign In' : 'Logout')}</a>
      </div>
    </div>
  );
};

export default Navbar;
