import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, editTodo } from '../store/todoSlice';
import './TodoItem.css';

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleEdit = () => {
    if (editText.trim() !== '') {
      dispatch(editTodo({
        id: todo.id,
        updates: { text: editText }
      }));
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#fda085';
      case 'low':
        return '#4ecdc4';
      default:
        return '#fda085';
    }
  };

  return (
    <div className="todo-item" style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <button onClick={handleEdit} className="save-button">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        ) : (
          <div className="todo-details">
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </span>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
            {todo.dueDate && (
              <span className="todo-due-date">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        )}
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem; 