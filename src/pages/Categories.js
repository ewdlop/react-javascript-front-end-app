import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addCategory, deleteCategory } from '../store/todoSlice';
import './Categories.css';

function Categories() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const categories = useSelector((state) => state.todos.categories);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      dispatch(addCategory({
        name: newCategory.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }));
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(categoryId));
    }
  };

  const getTodosByCategory = (categoryName) => {
    return todos.filter(todo => todo.category === categoryName);
  };

  return (
    <div className="categories-page">
      <div className="container">
        <h1>Categories</h1>

        <div className="add-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="category-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button onClick={handleAddCategory} className="add-button">
            Add Category
          </button>
        </div>

        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card" style={{ borderColor: category.color }}>
              <div className="category-header">
                <h3 style={{ color: category.color }}>{category.name}</h3>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="delete-button"
                  title="Delete category"
                >
                  ×
                </button>
              </div>
              
              <div className="category-stats">
                <div className="stat">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">{getTodosByCategory(category.name).length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">
                    {getTodosByCategory(category.name).filter(todo => todo.completed).length}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Active</span>
                  <span className="stat-value">
                    {getTodosByCategory(category.name).filter(todo => !todo.completed).length}
                  </span>
                </div>
              </div>

              <div className="category-todos">
                {getTodosByCategory(category.name).slice(0, 3).map(todo => (
                  <div key={todo.id} className="todo-preview">
                    <span className={`todo-status ${todo.completed ? 'completed' : ''}`} />
                    <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                      {todo.text}
                    </span>
                    <span className={`priority-indicator ${todo.priority}`} />
                  </div>
                ))}
                {getTodosByCategory(category.name).length > 3 && (
                  <div className="more-todos">
                    +{getTodosByCategory(category.name).length - 3} more tasks
                  </div>
                )}
                {getTodosByCategory(category.name).length === 0 && (
                  <div className="no-todos">
                    No tasks in this category
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Categories; 