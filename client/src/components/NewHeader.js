import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NewHeader.css';

const NewHeader = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="new-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>Chapter 2</h1>
          </Link>
        </div>
        <nav className="nav-menu">
          <button 
            className="nav-link" 
            onClick={() => onNavigate && onNavigate('author')}
          >
            Author
          </button>
          <button 
            className="nav-link" 
            onClick={() => onNavigate && onNavigate('reader')}
          >
            Reader
          </button>
          <button 
            className="nav-link" 
            onClick={() => onNavigate && onNavigate('genre')}
          >
            Choose Genre
          </button>
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Welcome, {user?.name}</span>
              <button onClick={logout} className="nav-link logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signup" className="signup-btn" onClick={() => navigate('/signup')}>
              Signup
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NewHeader;




