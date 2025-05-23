import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Statistics.css';

function Statistics() {
  const todos = useSelector((state) => state.todos.items);

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    highPriority: todos.filter(todo => todo.priority === 'high').length,
    mediumPriority: todos.filter(todo => todo.priority === 'medium').length,
    lowPriority: todos.filter(todo => todo.priority === 'low').length,
    withDueDate: todos.filter(todo => todo.dueDate).length,
    overdue: todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < new Date();
    }).length,
  };

  const completionRate = stats.total ? (stats.completed / stats.total * 100).toFixed(1) : 0;

  return (
    <div className="statistics-page">
      <div className="container">
        <h1>Task Statistics</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          
          <div className="stat-card">
            <h3>Completion Rate</h3>
            <p className="stat-number">{completionRate}%</p>
          </div>
          
          <div className="stat-card">
            <h3>Active Tasks</h3>
            <p className="stat-number">{stats.active}</p>
          </div>
          
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
        </div>

        <div className="priority-stats">
          <h2>Priority Distribution</h2>
          <div className="priority-bars">
            <div className="priority-bar">
              <span>High Priority</span>
              <div className="bar-container">
                <div 
                  className="bar high" 
                  style={{ width: `${(stats.highPriority / stats.total * 100) || 0}%` }}
                ></div>
              </div>
              <span>{stats.highPriority}</span>
            </div>
            
            <div className="priority-bar">
              <span>Medium Priority</span>
              <div className="bar-container">
                <div 
                  className="bar medium" 
                  style={{ width: `${(stats.mediumPriority / stats.total * 100) || 0}%` }}
                ></div>
              </div>
              <span>{stats.mediumPriority}</span>
            </div>
            
            <div className="priority-bar">
              <span>Low Priority</span>
              <div className="bar-container">
                <div 
                  className="bar low" 
                  style={{ width: `${(stats.lowPriority / stats.total * 100) || 0}%` }}
                ></div>
              </div>
              <span>{stats.lowPriority}</span>
            </div>
          </div>
        </div>

        <div className="due-date-stats">
          <h2>Due Date Statistics</h2>
          <div className="stat-cards">
            <div className="stat-card">
              <h3>Tasks with Due Dates</h3>
              <p className="stat-number">{stats.withDueDate}</p>
            </div>
            
            <div className="stat-card">
              <h3>Overdue Tasks</h3>
              <p className="stat-number">{stats.overdue}</p>
            </div>
          </div>
        </div>

        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Statistics; 