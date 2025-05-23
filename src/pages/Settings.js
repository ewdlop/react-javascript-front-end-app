import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [defaultPriority, setDefaultPriority] = useState('medium');
  const [defaultDueDate, setDefaultDueDate] = useState('none');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // TODO: Implement theme change logic
  };

  const handleNotificationsChange = (enabled) => {
    setNotifications(enabled);
    // TODO: Implement notifications logic
  };

  const handleDefaultPriorityChange = (priority) => {
    setDefaultPriority(priority);
    // TODO: Implement default priority logic
  };

  const handleDefaultDueDateChange = (dueDate) => {
    setDefaultDueDate(dueDate);
    // TODO: Implement default due date logic
  };

  return (
    <div className="settings-page">
      <div className="container">
        <h1>Settings</h1>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-options">
              <button 
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </button>
              <button 
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Default Values</h2>
          <div className="setting-item">
            <label>Default Priority</label>
            <select 
              value={defaultPriority}
              onChange={(e) => handleDefaultPriorityChange(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>Default Due Date</label>
            <select 
              value={defaultDueDate}
              onChange={(e) => handleDefaultDueDateChange(e.target.value)}
            >
              <option value="none">None</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="nextWeek">Next Week</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Management</h2>
          <div className="setting-item">
            <button className="danger-button">Clear All Data</button>
            <button className="secondary-button">Export Data</button>
            <button className="secondary-button">Import Data</button>
          </div>
        </div>

        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Settings; 