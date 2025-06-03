import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { FaUserCircle, FaSearch, FaBookOpen, FaPlus, FaSignInAlt, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useCurrentUser } from './CurrentUser';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Navbar = ({ isAdmin = false }) => {
  const { user, profile } = useCurrentUser();
  const [open, setOpen] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const [editing, setEditing] = useState(false);
  const [newPfpUrl, setNewPfpUrl] = useState('');

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profilePic: newPfpUrl,
      });
      alert('Profile picture updated!');
      setNewPfpUrl('');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile picture');
    }
  };

  useEffect(() => {
    const guest = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guest);
  }, []);

  const handleAuthClick = () => {
    localStorage.removeItem('isGuest');
    window.location.href = isGuest ? '/auth' : '/';
  };

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
          {open && (
            <div className="user-info">
              <p className="username">
                {isGuest
                  ? 'Guest'
                  : profile?.username || user?.email || 'User'}
              </p>
              <div className="profile-pic-container">
                {profile?.profilePic && !isGuest && (
                  <>
                    <img
                      src={profile.profilePic}
                      alt="Profile"
                      className="pfp"
                      onMouseEnter={() => setEditing(true)}
                      onMouseLeave={() => setEditing(false)}
                    />
                    {editing && (
                      <form className="edit-pfp-form" onSubmit={handleProfilePicSubmit}>
                        <input
                          type="text"
                          placeholder="Paste new image URL"
                          value={newPfpUrl}
                          onChange={(e) => setNewPfpUrl(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button type="submit">Save</button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <hr />

        <nav className="nav-links">
          <a href="#"><FaSearch /> {open && 'Browse Recipes'}</a>
          <a href="#"><FaBookOpen /> {open && 'My Recipes'}</a>
          <a href="#"><FaPlus /> {open && 'Add Recipe'}</a>
          {isAdmin && (
            <a href="#"><MdDashboard /> {open && 'Admin Dashboard'}</a>
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
