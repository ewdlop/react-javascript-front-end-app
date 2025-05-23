import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlice';
import './TodoForm.css';

function TodoForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium',
    dueDate: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.text.trim() !== '') {
      dispatch(addTodo(formData));
      setFormData({
        text: '',
        priority: 'medium',
        dueDate: '',
        description: '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Add a new task..."
          className="todo-input"
          required
        />
      </div>
      
      <div className="form-group">
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="date-input"
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add description (optional)"
          className="description-input"
        />
      </div>

      <button type="submit" className="add-button">
        Add Task
      </button>
    </form>
  );
}

export default TodoForm; 