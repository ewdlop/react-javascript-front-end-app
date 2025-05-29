import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '../store/todoSlice';
import './TodoForm.css';

function TodoForm() {
  const dispatch = useDispatch();
  const defaultPriority = useSelector((state) => state.todos?.defaultPriority || 'medium');
  const defaultDueDate = useSelector((state) => state.todos?.defaultDueDate || 'none');
  const categories = useSelector((state) => state.todos?.categories || []);
  
  const [formData, setFormData] = useState({
    text: '',
    priority: defaultPriority,
    dueDate: getDefaultDueDate(),
    description: '',
    category: '',
  });

  function getDefaultDueDate() {
    const today = new Date();
    switch (defaultDueDate) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      case 'nextWeek':
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString().split('T')[0];
      default:
        return '';
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.text.trim() !== '') {
      dispatch(addTodo(formData));
      setFormData({
        text: '',
        priority: defaultPriority,
        dueDate: getDefaultDueDate(),
        description: '',
        category: '',
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
      <div className="form-row">
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
      </div>

      <div className="form-row">
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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="category-select"
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
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