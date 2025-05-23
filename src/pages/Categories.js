import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Categories.css';

function Categories() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work', color: '#ff6b6b' },
    { id: 2, name: 'Personal', color: '#4ecdc4' },
    { id: 3, name: 'Shopping', color: '#fda085' },
    { id: 4, name: 'Health', color: '#95e1d3' }
  ]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([...categories, {
        id: newId,
        name: newCategory.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
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
              </div>

              <div className="category-todos">
                {getTodosByCategory(category.name).slice(0, 3).map(todo => (
                  <div key={todo.id} className="todo-preview">
                    <span className={`todo-status ${todo.completed ? 'completed' : ''}`} />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                ))}
                {getTodosByCategory(category.name).length > 3 && (
                  <div className="more-todos">
                    +{getTodosByCategory(category.name).length - 3} more tasks
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