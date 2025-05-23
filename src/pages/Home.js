import React from 'react';
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
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

  return (
    <div className="home-page">
      <div className="container">
        <h1>Todo List</h1>
        
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
          {sortedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home; 