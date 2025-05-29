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
  selectedTodos: [], // For bulk operations
  showCompleted: true,
  categories: [
    { id: 1, name: 'Work', color: '#ff6b6b' },
    { id: 2, name: 'Personal', color: '#4ecdc4' },
    { id: 3, name: 'Shopping', color: '#fda085' },
    { id: 4, name: 'Health', color: '#95e1d3' }
  ],
  tags: [
    { id: 1, name: 'urgent', color: '#ff6b6b' },
    { id: 2, name: 'important', color: '#fda085' },
    { id: 3, name: 'meeting', color: '#4ecdc4' },
    { id: 4, name: 'review', color: '#95e1d3' }
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
        tags: action.payload.tags || [],
        subtasks: action.payload.subtasks || [],
        estimatedTime: action.payload.estimatedTime || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: state.items.length,
      });
      saveState(state);
    },
    editTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.items.find((todo) => todo.id === id);
      if (todo) {
        Object.assign(todo, updates);
        todo.updatedAt = new Date().toISOString();
      }
      saveState(state);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();
        if (todo.completed) {
          todo.completedAt = new Date().toISOString();
        } else {
          delete todo.completedAt;
        }
      }
      saveState(state);
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
      state.selectedTodos = state.selectedTodos.filter(id => id !== action.payload);
      saveState(state);
    },
    reorderTodos: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.items);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      result.forEach((todo, index) => {
        todo.order = index;
      });
      
      state.items = result;
      saveState(state);
    },
    toggleTodoSelection: (state, action) => {
      const todoId = action.payload;
      const isSelected = state.selectedTodos.includes(todoId);
      if (isSelected) {
        state.selectedTodos = state.selectedTodos.filter(id => id !== todoId);
      } else {
        state.selectedTodos.push(todoId);
      }
    },
    selectAllTodos: (state) => {
      state.selectedTodos = state.items.map(todo => todo.id);
    },
    clearSelection: (state) => {
      state.selectedTodos = [];
    },
    bulkMarkComplete: (state) => {
      const now = new Date().toISOString();
      state.selectedTodos.forEach(id => {
        const todo = state.items.find(t => t.id === id);
        if (todo) {
          todo.completed = true;
          todo.updatedAt = now;
          todo.completedAt = now;
        }
      });
      state.selectedTodos = [];
      saveState(state);
    },
    bulkMarkIncomplete: (state) => {
      const now = new Date().toISOString();
      state.selectedTodos.forEach(id => {
        const todo = state.items.find(t => t.id === id);
        if (todo) {
          todo.completed = false;
          todo.updatedAt = now;
          delete todo.completedAt;
        }
      });
      state.selectedTodos = [];
      saveState(state);
    },
    bulkDelete: (state) => {
      state.items = state.items.filter(todo => !state.selectedTodos.includes(todo.id));
      state.selectedTodos = [];
      saveState(state);
    },
    bulkSetPriority: (state, action) => {
      const priority = action.payload;
      const now = new Date().toISOString();
      state.selectedTodos.forEach(id => {
        const todo = state.items.find(t => t.id === id);
        if (todo) {
          todo.priority = priority;
          todo.updatedAt = now;
        }
      });
      state.selectedTodos = [];
      saveState(state);
    },
    addSubtask: (state, action) => {
      const { todoId, subtask } = action.payload;
      const todo = state.items.find(t => t.id === todoId);
      if (todo) {
        if (!todo.subtasks) todo.subtasks = [];
        todo.subtasks.push({
          id: Date.now(),
          text: subtask,
          completed: false,
          createdAt: new Date().toISOString()
        });
        todo.updatedAt = new Date().toISOString();
      }
      saveState(state);
    },
    toggleSubtask: (state, action) => {
      const { todoId, subtaskId } = action.payload;
      const todo = state.items.find(t => t.id === todoId);
      if (todo && todo.subtasks) {
        const subtask = todo.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          todo.updatedAt = new Date().toISOString();
        }
      }
      saveState(state);
    },
    deleteSubtask: (state, action) => {
      const { todoId, subtaskId } = action.payload;
      const todo = state.items.find(t => t.id === todoId);
      if (todo && todo.subtasks) {
        todo.subtasks = todo.subtasks.filter(s => s.id !== subtaskId);
        todo.updatedAt = new Date().toISOString();
      }
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
    setShowCompleted: (state, action) => {
      state.showCompleted = action.payload;
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
    addTag: (state, action) => {
      const newId = Math.max(...state.tags.map(t => t.id), 0) + 1;
      state.tags.push({
        id: newId,
        name: action.payload.name,
        color: action.payload.color || `#${Math.floor(Math.random()*16777215).toString(16)}`
      });
      saveState(state);
    },
    deleteTag: (state, action) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload);
      saveState(state);
    },
    clearAllData: (state) => {
      state.items = [];
      state.selectedTodos = [];
      state.categories = [
        { id: 1, name: 'Work', color: '#ff6b6b' },
        { id: 2, name: 'Personal', color: '#4ecdc4' },
        { id: 3, name: 'Shopping', color: '#fda085' },
        { id: 4, name: 'Health', color: '#95e1d3' }
      ];
      state.tags = [
        { id: 1, name: 'urgent', color: '#ff6b6b' },
        { id: 2, name: 'important', color: '#fda085' },
        { id: 3, name: 'meeting', color: '#4ecdc4' },
        { id: 4, name: 'review', color: '#95e1d3' }
      ];
      saveState(state);
    },
    importData: (state, action) => {
      const importedData = action.payload;
      if (importedData.items) state.items = importedData.items;
      if (importedData.categories) state.categories = importedData.categories;
      if (importedData.tags) state.tags = importedData.tags;
      state.selectedTodos = [];
      saveState(state);
    }
  },
});

export const { 
  addTodo, 
  editTodo, 
  toggleTodo, 
  deleteTodo,
  reorderTodos,
  toggleTodoSelection,
  selectAllTodos,
  clearSelection,
  bulkMarkComplete,
  bulkMarkIncomplete,
  bulkDelete,
  bulkSetPriority,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  setFilter, 
  setSortBy,
  setTheme,
  setNotifications,
  setDefaultPriority,
  setDefaultDueDate,
  setShowCompleted,
  addCategory,
  deleteCategory,
  addTag,
  deleteTag,
  clearAllData,
  importData
} = todoSlice.actions;

export default todoSlice.reducer; 