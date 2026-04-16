import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during login');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Welcome Back</h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Sign in to access Churn Predictions</p>
        
        {error && <div style={{color: 'var(--error)', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem'}}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
