import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import GuestPage from './routes/GuestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guest" element={<GuestPage />} /> {/** Placeholder*/}
      </Routes>
    </Router>
  );
}

export default App;
