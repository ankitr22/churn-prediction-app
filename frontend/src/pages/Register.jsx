import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('/api/auth/register', {
        username,
        password
      });
      
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during registration');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Create Account</h2>
        <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>Join us to start predicting churn</p>
        
        {error && <div style={{color: 'var(--error)', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem'}}>{error}</div>}
        {success && <div style={{color: 'var(--success)', marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem'}}>{success}</div>}
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Choose a secure password"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
            Sign Up
          </button>
        </form>
        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary-color)'}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
