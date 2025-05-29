import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setSortBy, setShowCompleted } from '../store/todoSlice';
import TodoForm from '../components/TodoForm';
import BulkActions from '../components/BulkActions';
import DragDropTodoList from '../components/DragDropTodoList';
import './Home.css';

function Home() {
  const todos = useSelector((state) => state.todos?.items || []);
  const filter = useSelector((state) => state.todos?.filter || 'all');
  const sortBy = useSelector((state) => state.todos?.sortBy || 'priority');
  const showCompleted = useSelector((state) => state.todos?.showCompleted ?? true);
  const theme = useSelector((state) => state.todos?.theme || 'light');
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const filteredTodos = todos.filter((todo) => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (todo.category && todo.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Status filter
    const matchesStatus = filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    
    // Show completed filter
    const matchesShowCompleted = showCompleted || !todo.completed;
    
    return matchesSearch && matchesStatus && matchesShowCompleted;
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
      case 'updated':
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      case 'alphabetical':
        return a.text.localeCompare(b.text);
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
    }).length,
    highPriority: todos.filter(todo => todo.priority === 'high' && !todo.completed).length
  };

  return (
    <div className={`home-page ${theme}`}>
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
          <div className="stat-item">
            <span className="stat-number high-priority">{stats.highPriority}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, categories, or tags..."
            className="search-input"
          />
        </div>
        
        <div className="controls-section">
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
              <option value="updated">Sort by Updated Date</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>
          </div>

          <div className="view-options">
            <label className="show-completed-toggle">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => dispatch(setShowCompleted(e.target.checked))}
              />
              <span>Show Completed</span>
            </label>
          </div>
        </div>

        <TodoForm />
        
        <BulkActions />
        
        <div className="todo-list-section">
          <div className="list-header">
            <h3>
              Tasks {searchQuery && `matching "${searchQuery}"`}
              <span className="task-count">({sortedTodos.length})</span>
            </h3>
          </div>
          
          <DragDropTodoList todos={sortedTodos} />
        </div>
      </div>
    </div>
  );
}

export default Home; 