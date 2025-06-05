import React, { useState, useEffect  } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, provider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import '../styles/LoginSignup.css';


const LoginSignup = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isSignup = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setSearchParams({ mode: isSignup ? 'login' : 'signup' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const response = await fetch('http://localhost:5050/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: username,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
  
        alert('Account created! Redirecting to login...');
        setSearchParams({ mode: 'login' }); 
        return; 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home'); {/*REPLACE WITH THE DASHBOARD*/}
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };
  
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="back-wrapper">
          <span onClick={() => navigate('/')} className="back-text">
            ← Back
          </span>
        </div>

        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <button type="submit">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p style={{ marginTop: '1rem' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
