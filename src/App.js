import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import Search from './pages/Search';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router basename="/react-javascript-front-end-app">
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 