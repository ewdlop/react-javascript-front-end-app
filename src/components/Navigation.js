import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Todo List', icon: '📝' },
    { path: '/categories', label: 'Categories', icon: '📁' },
    { path: '/tags', label: 'Tags', icon: '🏷️' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/statistics', label: 'Statistics', icon: '📊' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">✅</span>
          <span className="brand-text">TodoApp</span>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 