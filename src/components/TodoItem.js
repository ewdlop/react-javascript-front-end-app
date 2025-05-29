import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  toggleTodo, 
  deleteTodo, 
  editTodo, 
  toggleTodoSelection,
  addSubtask,
  toggleSubtask,
  deleteSubtask
} from '../store/todoSlice';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import './TodoItem.css';

function TodoItem({ todo, index, isDragDisabled = false }) {
  const dispatch = useDispatch();
  const selectedTodos = useSelector((state) => state.todos?.selectedTodos || []);
  const categories = useSelector((state) => state.todos?.categories || []);
  const tags = useSelector((state) => state.todos?.tags || []);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);

  const isSelected = selectedTodos.includes(todo.id);
  const isOverdue = todo.dueDate && !todo.completed && isPast(new Date(todo.dueDate));
  const category = categories.find(cat => cat.name === todo.category);

  const handleSave = () => {
    dispatch(editTodo({
      id: todo.id,
      updates: {
        text: editText,
        description: editDescription,
        priority: editPriority,
        dueDate: editDueDate || null,
        category: editCategory
      }
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setEditCategory(todo.category || '');
    setIsEditing(false);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTodo(todo.id));
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(toggleTodoSelection(todo.id));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      dispatch(addSubtask({ todoId: todo.id, subtask: newSubtask.trim() }));
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    dispatch(toggleSubtask({ todoId: todo.id, subtaskId }));
  };

  const handleDeleteSubtask = (subtaskId) => {
    dispatch(deleteSubtask({ todoId: todo.id, subtaskId }));
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getCompletionProgress = () => {
    if (!todo.subtasks || todo.subtasks.length === 0) return 0;
    const completed = todo.subtasks.filter(subtask => subtask.completed).length;
    return (completed / todo.subtasks.length) * 100;
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="todo-select"
        />
        
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />

        <div className="todo-content" onClick={() => setIsExpanded(!isExpanded)}>
          {isEditing ? (
            <div className="edit-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-text"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                className="edit-description"
              />
              <div className="edit-controls">
                <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <button onClick={handleSave} className="save-btn">Save</button>
                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="todo-info">
              <div className="todo-header">
                <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                  {todo.text}
                </span>
                <div className="todo-badges">
                  <span className={`priority-badge ${todo.priority}`}>
                    {todo.priority}
                  </span>
                  {category && (
                    <span 
                      className="category-badge" 
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                      {formatDueDate(todo.dueDate)}
                    </span>
                  )}
                  {todo.subtasks && todo.subtasks.length > 0 && (
                    <span className="subtask-count">
                      {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length}
                    </span>
                  )}
                </div>
              </div>
              
              {todo.description && (
                <div className="todo-description">
                  {todo.description}
                </div>
              )}

              {todo.subtasks && todo.subtasks.length > 0 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getCompletionProgress()}%` }}
                  />
                </div>
              )}

              {todo.tags && todo.tags.length > 0 && (
                <div className="todo-tags">
                  {todo.tags.map(tagName => {
                    const tag = tags.find(t => t.name === tagName);
                    return tag ? (
                      <span 
                        key={tag.id} 
                        className="tag-badge"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="todo-actions">
            <button 
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="action-btn"
              title="Subtasks"
            >
              📋
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="action-btn"
              title="Edit"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              className="action-btn delete-btn"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {(isExpanded || showSubtasks) && (
        <div className="todo-expanded">
          {showSubtasks && (
            <div className="subtasks-section">
              <h4>Subtasks</h4>
              <div className="add-subtask">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <button onClick={handleAddSubtask}>Add</button>
              </div>
              
              {todo.subtasks && todo.subtasks.map(subtask => (
                <div key={subtask.id} className="subtask-item">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                  />
                  <span className={subtask.completed ? 'completed-text' : ''}>
                    {subtask.text}
                  </span>
                  <button 
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="delete-subtask-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {todo.estimatedTime && (
            <div className="time-info">
              <span>Estimated: {todo.estimatedTime}h</span>
              {todo.actualTime && <span>Actual: {todo.actualTime}h</span>}
            </div>
          )}

          <div className="todo-meta">
            <small>Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}</small>
            {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
              <small>Updated: {format(new Date(todo.updatedAt), 'MMM dd, yyyy')}</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem; 