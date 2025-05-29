import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addTag, deleteTag } from '../store/todoSlice';
import './Tags.css';

function Tags() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos?.items || []);
  const tags = useSelector((state) => state.todos?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4ecdc4');

  const handleAddTag = () => {
    if (newTag.trim()) {
      dispatch(addTag({
        name: newTag.trim().toLowerCase(),
        color: newTagColor
      }));
      setNewTag('');
      setNewTagColor('#4ecdc4');
    }
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      dispatch(deleteTag(tagId));
    }
  };

  const getTodosByTag = (tagName) => {
    return todos.filter(todo => todo.tags && todo.tags.includes(tagName));
  };

  const colorOptions = [
    '#ff6b6b', '#fda085', '#4ecdc4', '#95e1d3', 
    '#a8e6cf', '#ffd93d', '#6c5ce7', '#fd79a8',
    '#fdcb6e', '#74b9ff', '#00b894', '#e17055'
  ];

  return (
    <div className="tags-page">
      <div className="container">
        <h1>Tags</h1>

        <div className="add-tag">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag name"
            className="tag-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <div className="color-selector">
            {colorOptions.map(color => (
              <button
                key={color}
                className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTagColor(color)}
                title={color}
              />
            ))}
          </div>
          <button onClick={handleAddTag} className="add-button">
            Add Tag
          </button>
        </div>

        <div className="tags-grid">
          {tags.map(tag => (
            <div key={tag.id} className="tag-card" style={{ borderColor: tag.color }}>
              <div className="tag-header">
                <div className="tag-info">
                  <span 
                    className="tag-color-indicator"
                    style={{ backgroundColor: tag.color }}
                  />
                  <h3 style={{ color: tag.color }}>#{tag.name}</h3>
                </div>
                <button 
                  onClick={() => handleDeleteTag(tag.id)}
                  className="delete-button"
                  title="Delete tag"
                >
                  ×
                </button>
              </div>
              
              <div className="tag-stats">
                <div className="stat">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">{getTodosByTag(tag.name).length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">
                    {getTodosByTag(tag.name).filter(todo => todo.completed).length}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Active</span>
                  <span className="stat-value">
                    {getTodosByTag(tag.name).filter(todo => !todo.completed).length}
                  </span>
                </div>
              </div>

              <div className="tag-todos">
                {getTodosByTag(tag.name).slice(0, 3).map(todo => (
                  <div key={todo.id} className="todo-preview">
                    <span className={`todo-status ${todo.completed ? 'completed' : ''}`} />
                    <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                      {todo.text}
                    </span>
                    <span className={`priority-indicator ${todo.priority}`} />
                  </div>
                ))}
                {getTodosByTag(tag.name).length > 3 && (
                  <div className="more-todos">
                    +{getTodosByTag(tag.name).length - 3} more tasks
                  </div>
                )}
                {getTodosByTag(tag.name).length === 0 && (
                  <div className="no-todos">
                    No tasks with this tag
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="no-tags-message">
            <p>No tags created yet. Add your first tag above!</p>
          </div>
        )}

        <Link to="/" className="back-button">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}

export default Tags; 