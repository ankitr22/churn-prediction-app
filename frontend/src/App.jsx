import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Guide from './pages/Guide';
import About from './pages/About';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Update token specifically if another window changes it (or direct set)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-brand">PreChurn AI</Link>
        <div className="nav-links">
          {token && <Link to="/" className="nav-link">Home</Link>}
          {token && <Link to="/guide" className="nav-link">Guide</Link>}
          <Link to="/about" className="nav-link">About</Link>
          {token ? (
            <button onClick={handleLogout} className="btn" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/guide" element={token ? <Guide /> : <Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
