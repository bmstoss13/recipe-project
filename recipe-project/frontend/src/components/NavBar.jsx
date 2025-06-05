import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { FaUserCircle, FaSearch, FaBookOpen, FaPlus, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useCurrentUser } from './CurrentUser';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from 'react-router-dom';


const Navbar = () => {
  const { user, profile } = useCurrentUser();
  const [open, setOpen] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPfpUrl, setNewPfpUrl] = useState('');

  useEffect(() => {
    const guest = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guest);
  }, []);

  const handleAuthClick = async () => {
    try {
      if (!isGuest) {
        await signOut(auth);
      }
  
      localStorage.removeItem("isGuest");
      window.location.href = isGuest ? "/auth" : "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { profileImage: newPfpUrl });
      toast.success('Profile picture updated!');
      setModalOpen(false);
      setNewPfpUrl('');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile picture');
    }
  };

  return (
    <>
      <div className={`sidebar ${open ? 'open' : 'closed'}`}>
        <div className="top-section">
          <div className={`toggle-container ${open ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={() => setOpen(!open)}>
              <FaBars />
            </button>
          </div>

          <div className="profile">
            <div
              className="profile-pic-wrapper"
              onMouseEnter={() => !isGuest && setEditing(true)}
              onMouseLeave={() => !isGuest && setEditing(false)}
            >
              {profile?.profileImage && !isGuest ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className={`profile-icon-img ${open ? 'expanded' : 'collapsed'}`}
                />
              ) : (
                <FaUserCircle className={`profile-icon ${open ? 'expanded' : 'collapsed'} ${isGuest ? 'no-hover' : ''}`} />
              )}
              {!isGuest && (
              <div className="change-pfp-overlay" onClick={() => setModalOpen(true)}>
                Change
              </div>
              )}
            </div>

            {open && (
              <div className="user-info">
                <p className="username">
                  {isGuest ? 'Guest' : profile?.username || user?.email || 'User'}
                </p>
              </div>
            )}
          </div>

          <hr />

          <nav className="nav-links">
            <Link to="/recipes"><FaSearch /> {open && 'Browse Recipes'}</Link>
            <Link to="/my-recipes"><FaBookOpen /> {open && 'My Recipes'}</Link>
            <Link to="/create-recipe"><FaPlus /> {open && 'Add Recipe'}</Link>
            {profile?.isAdmin && (
              <Link to="/admin"><MdDashboard /> {open && 'Admin Dashboard'}</Link>
            )}
            <Link to="/recipeDetail">{open && 'TEMP - recipe detail'}</Link>
          </nav>
        </div>

        <div className="logout-btn">
          <a href="#" onClick={handleAuthClick}>
            {open && (isGuest ? 'Sign In' : 'Logout')}
          </a>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Paste Profile Image URL</h3>
            <form onSubmit={handleProfilePicSubmit}>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={newPfpUrl}
                onChange={(e) => setNewPfpUrl(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;