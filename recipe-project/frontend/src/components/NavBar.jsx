import React from 'react'; 
import '../styles/Navbar.css';
import { FaUserCircle, FaSearch, FaBookOpen, FaPlus, FaSignInAlt, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';


const Navbar = ({ isAdmin = false, isGuest = false, isOpen, onToggle }) => {

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

        <hr></hr>

        <nav className="nav-links">
          <a href="#"><FaSearch /> {isOpen && 'Browse Recipes'}</a>
          <a href="#"><FaBookOpen /> {isOpen && 'My Recipes'}</a>
          <a href="#"><FaPlus /> {isOpen && 'Add Recipe'}</a>
          {isAdmin && (
            <a href="#"><MdDashboard /> {isOpen && 'Admin Dashboard'}</a>
          )}
        </nav>
      </div>

      <div className="logout-btn">
        <a href="#"><FaSignInAlt /> {isOpen && (isGuest ? 'Sign In' : 'Logout')}</a>
      </div>
    </div>
  );
};

export default Navbar;