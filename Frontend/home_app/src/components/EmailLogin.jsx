import { useState } from 'react';
import './EmailLoginStyle.css';

const EmailLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch('https://homeapp.ddns.net/api/users/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });
    if (response.ok) {
      // handle successful login
    } else {
      // handle failed login
    }
  };
  

  const handleSignUp = async (event) => {
    event.preventDefault();
    const response = await fetch('https://homeapp.ddns.net/api/users/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });
    if (response.ok) {
      // handle successful sign up
    } else {
      // handle failed sign up
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
            <button type="submit" className="form-button">Login</button>
            <br />
            <p className="form-text">
                Not signed up yet? <a href="#" className="form-link" onClick={handleSignUpClick}>Sign Up here!</a>
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
            <button type="submit" className="form-button">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default EmailLogin;
