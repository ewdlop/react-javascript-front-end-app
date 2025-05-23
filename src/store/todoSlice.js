import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filter: 'all', // 'all', 'active', 'completed'
  sortBy: 'priority', // 'priority', 'dueDate', 'created'
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        description: action.payload.description || '',
        createdAt: new Date().toISOString(),
      });
    },
    editTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.items.find((todo) => todo.id === id);
      if (todo) {
        Object.assign(todo, updates);
      }
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { 
  addTodo, 
  editTodo, 
  toggleTodo, 
  deleteTodo, 
  setFilter, 
  setSortBy 
} = todoSlice.actions;

export default todoSlice.reducer; 