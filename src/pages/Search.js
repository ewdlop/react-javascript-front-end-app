import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Search.css';

function Search() {
  const todos = useSelector((state) => state.todos.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    dueDate: 'all'
  });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const results = todos.filter(todo => {
      // Text search
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && todo.completed) ||
        (filters.status === 'active' && !todo.completed);
      
      // Priority filter
      const matchesPriority = filters.priority === 'all' || todo.priority === filters.priority;
      
      // Category filter
      const matchesCategory = filters.category === 'all' || todo.category === filters.category;
      
      // Due date filter
      let matchesDueDate = true;
      if (filters.dueDate !== 'all' && todo.dueDate) {
        const todoDate = new Date(todo.dueDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        switch (filters.dueDate) {
          case 'today':
            matchesDueDate = todoDate.toDateString() === today.toDateString();
            break;
          case 'tomorrow':
            matchesDueDate = todoDate.toDateString() === tomorrow.toDateString();
            break;
          case 'thisWeek':
            matchesDueDate = todoDate <= nextWeek;
            break;
          case 'overdue':
            matchesDueDate = todoDate < today && !todo.completed;
            break;
          default:
            matchesDueDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDueDate;
    });

    setSearchResults(results);
  }, [searchQuery, filters, todos]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const categories = [...new Set(todos.map(todo => todo.category).filter(Boolean))];

  return (
    <div className="search-page">
      <div className="container">
        <h1>Search Tasks</h1>

        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Due Date</label>
            <select
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisWeek">This Week</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="search-results">
          <h2>Results ({searchResults.length})</h2>
          {searchResults.length > 0 ? (
            <div className="results-list">
              {searchResults.map(todo => (
                <div key={todo.id} className={`result-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="result-content">
                    <span className={`priority-dot ${todo.priority}`} />
                    <span className="todo-text">{todo.text}</span>
                    {todo.category && (
                      <span className="category-tag">{todo.category}</span>
                    )}
                  </div>
                  {todo.dueDate && (
                    <span className="due-date">
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              No tasks found matching your search criteria
            </div>
          )}
        </div>

        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Search; 