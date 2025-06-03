import React from 'react';
import Navbar from '../components/Navbar';

const GuestPage = () => {
  return (
    <div>
      <Navbar isAdmin={true} />
      <div style={{ padding: '2rem', color: 'white' }}>
        <h1>Welcome, Guest!</h1>
        <p>This is the recipe hub.</p>
      </div>
    </div>
  );
};


export default GuestPage;