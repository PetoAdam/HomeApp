import React, { useState } from 'react';
import UserService from '../services/UserService';
import './EmailLoginStyle.css';

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await UserService.login({ email, password, username });
      // Handle successful login
    } catch (error) {
      // Handle failed login
      console.error('Error during login:', error);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await UserService.signup({ email, password, username });
      // Handle successful sign-up
    } catch (error) {
      // Handle failed sign-up
      console.error('Error during sign-up:', error);
    }
  };

  const handleSignUpClick = (event) => {
    event.preventDefault();
    setShowSignUp(true);
  };

  return (
    <div className="form-container">
      {!showSignUp ? (
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label className="form-label">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">
            Login
          </button>
          <br />
          <p className="form-text">
            Not signed up yet?{' '}
            <a href="#" className="form-link" onClick={handleSignUpClick}>
              Sign Up here!
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignUp}>
          <div className="form-field">
            <label className="form-label">Email:</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailLogin;
