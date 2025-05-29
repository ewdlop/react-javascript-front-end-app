import { createSlice } from '@reduxjs/toolkit';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('todoAppState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('todoAppState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = loadState() || {
  items: [],
  filter: 'all', // 'all', 'active', 'completed'
  sortBy: 'priority', // 'priority', 'dueDate', 'created'
  theme: 'light', // 'light', 'dark'
  notifications: true,
  defaultPriority: 'medium',
  defaultDueDate: 'none',
  categories: [
    { id: 1, name: 'Work', color: '#ff6b6b' },
    { id: 2, name: 'Personal', color: '#4ecdc4' },
    { id: 3, name: 'Shopping', color: '#fda085' },
    { id: 4, name: 'Health', color: '#95e1d3' }
  ]
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
        priority: action.payload.priority || state.defaultPriority,
        dueDate: action.payload.dueDate || null,
        description: action.payload.description || '',
        category: action.payload.category || '',
        createdAt: new Date().toISOString(),
      });
      saveState(state);
    },
    editTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.items.find((todo) => todo.id === id);
      if (todo) {
        Object.assign(todo, updates);
      }
      saveState(state);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      saveState(state);
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
      saveState(state);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      saveState(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      saveState(state);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveState(state);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      saveState(state);
    },
    setDefaultPriority: (state, action) => {
      state.defaultPriority = action.payload;
      saveState(state);
    },
    setDefaultDueDate: (state, action) => {
      state.defaultDueDate = action.payload;
      saveState(state);
    },
    addCategory: (state, action) => {
      const newId = Math.max(...state.categories.map(c => c.id), 0) + 1;
      state.categories.push({
        id: newId,
        name: action.payload.name,
        color: action.payload.color || `#${Math.floor(Math.random()*16777215).toString(16)}`
      });
      saveState(state);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      saveState(state);
    },
    clearAllData: (state) => {
      state.items = [];
      state.categories = [
        { id: 1, name: 'Work', color: '#ff6b6b' },
        { id: 2, name: 'Personal', color: '#4ecdc4' },
        { id: 3, name: 'Shopping', color: '#fda085' },
        { id: 4, name: 'Health', color: '#95e1d3' }
      ];
      saveState(state);
    },
    importData: (state, action) => {
      const importedData = action.payload;
      if (importedData.items) state.items = importedData.items;
      if (importedData.categories) state.categories = importedData.categories;
      saveState(state);
    }
  },
});

export const { 
  addTodo, 
  editTodo, 
  toggleTodo, 
  deleteTodo, 
  setFilter, 
  setSortBy,
  setTheme,
  setNotifications,
  setDefaultPriority,
  setDefaultDueDate,
  addCategory,
  deleteCategory,
  clearAllData,
  importData
} = todoSlice.actions;

export default todoSlice.reducer; 