import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Todo List
          </Link>
          <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>
            Categories
          </Link>
          <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
            Calendar
          </Link>
          <Link to="/statistics" className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}>
            Statistics
          </Link>
          <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
            Search
          </Link>
          <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 