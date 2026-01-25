import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>📚 BookSharing</h1>
        </div>
        <nav className="nav">
          {isAuthenticated ? (
            <div className="user-menu">
              <span>Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <span>Guest</span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

