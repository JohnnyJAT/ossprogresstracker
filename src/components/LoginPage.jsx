import React, { useState } from 'react';
// import bcrypt from 'bcryptjs';

const adminPasswordHash = '$2a$12$iVPZnA1xEbXI69wYr19s2O94aagCZ2ziCjUi5ZtdWZBcqC0aTOREG';
const adminUsername = 'PersonalHeroAvatar';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const sanitizeInput = (input) => {
    return input.replace(/[&<>"'/`|;*?()$:,~]/g, '');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const sanitizedUsername = sanitizeInput(username);

    if (sanitizedUsername !== adminUsername) {
      setError('Invalid username or password.');
      return;
    }

    // Compare the entered password with the stored hash
    bcrypt.compare(password, adminPasswordHash, (err, isMatch) => {
      if (err) {
        setError('An error occurred. Please try again.');
        return;
      }
      if (isMatch) {
        onLoginSuccess();
      } else {
        setError('Invalid username or password.');
      }
    });

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="sidebar-header">
          <h1>Gym Tracker</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
