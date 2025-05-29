import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setSortBy } from '../store/todoSlice';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import './Home.css';

function Home() {
  const todos = useSelector((state) => state.todos.items);
  const filter = useSelector((state) => state.todos.filter);
  const sortBy = useSelector((state) => state.todos.sortBy);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = todos.filter((todo) => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    
    return matchesSearch && matchesStatus;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    overdue: todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < new Date();
    }).length
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1>Todo List</h1>
        
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number overdue">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="sort-select"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="created">Sort by Created Date</option>
          </select>
        </div>

        <TodoForm />
        
        <div className="todo-list">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          ) : (
            <div className="no-todos">
              {searchQuery ? 'No tasks match your search' : 'No tasks found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 