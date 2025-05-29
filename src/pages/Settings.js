import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  setTheme, 
  setNotifications, 
  setDefaultPriority, 
  setDefaultDueDate,
  clearAllData,
  importData
} from '../store/todoSlice';
import './Settings.css';

function Settings() {
  const dispatch = useDispatch();
  const {
    theme = 'light',
    notifications = true,
    defaultPriority = 'medium',
    defaultDueDate = 'none',
    items = [],
    categories = []
  } = useSelector((state) => state.todos || {});

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    // Apply theme to body class
    document.body.className = newTheme;
  };

  const handleNotificationsChange = (enabled) => {
    dispatch(setNotifications(enabled));
  };

  const handleDefaultPriorityChange = (priority) => {
    dispatch(setDefaultPriority(priority));
  };

  const handleDefaultDueDateChange = (dueDate) => {
    dispatch(setDefaultDueDate(dueDate));
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dispatch(clearAllData());
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      items,
      categories,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (window.confirm('Are you sure you want to import this data? This will replace your current data.')) {
            dispatch(importData(importedData));
          }
        } catch (error) {
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`settings-page ${theme}`}>
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
            <button className="danger-button" onClick={handleClearAllData}>
              Clear All Data
            </button>
            <button className="secondary-button" onClick={handleExportData}>
              Export Data
            </button>
            <label className="secondary-button file-input-label">
              Import Data
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
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