import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllTodos,
  clearSelection,
  bulkMarkComplete,
  bulkMarkIncomplete,
  bulkDelete,
  bulkSetPriority
} from '../store/todoSlice';
import './BulkActions.css';

function BulkActions() {
  const dispatch = useDispatch();
  const { selectedTodos = [], items = [] } = useSelector((state) => state.todos || {});
  
  const selectedCount = selectedTodos.length;
  const totalCount = items.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllTodos());
    }
  };

  const handleMarkComplete = () => {
    dispatch(bulkMarkComplete());
  };

  const handleMarkIncomplete = () => {
    dispatch(bulkMarkIncomplete());
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected tasks?`)) {
      dispatch(bulkDelete());
    }
  };

  const handleSetPriority = (priority) => {
    dispatch(bulkSetPriority(priority));
  };

  if (totalCount === 0) return null;

  return (
    <div className={`bulk-actions ${selectedCount > 0 ? 'active' : ''}`}>
      <div className="selection-info">
        <label className="select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          />
          <span>
            {selectedCount > 0 
              ? `${selectedCount} selected` 
              : `Select all (${totalCount})`
            }
          </span>
        </label>
      </div>

      {selectedCount > 0 && (
        <div className="bulk-controls">
          <button 
            onClick={handleMarkComplete}
            className="bulk-btn complete-btn"
            title="Mark selected as complete"
          >
            ✓ Complete
          </button>
          
          <button 
            onClick={handleMarkIncomplete}
            className="bulk-btn incomplete-btn"
            title="Mark selected as incomplete"
          >
            ○ Incomplete
          </button>

          <div className="priority-dropdown">
            <select 
              onChange={(e) => e.target.value && handleSetPriority(e.target.value)}
              value=""
              className="bulk-btn priority-btn"
            >
              <option value="">Set Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <button 
            onClick={handleDelete}
            className="bulk-btn delete-btn"
            title="Delete selected tasks"
          >
            🗑️ Delete
          </button>

          <button 
            onClick={() => dispatch(clearSelection())}
            className="bulk-btn clear-btn"
            title="Clear selection"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default BulkActions; 