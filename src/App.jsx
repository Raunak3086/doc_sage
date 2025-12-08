import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Interact from './pages/Interact';
import Login from './pages/Login';        
import Register from './pages/Register';  
import './components/buttons.css';
import './App.css';

function AppContent() {
  const [selectedTheme, setSelectedTheme] = useState('red');
  const location = useLocation();

  // Sync theme from localStorage and URL changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'red';
    setSelectedTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [location]);

  const updateTheme = (theme) => {
    setSelectedTheme(theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selectedTheme', theme);
  };

  return (
    <div className="morphin-grid-command-center">
      <div className="grid-matrix"></div>
      <div className="command-center-routes">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interact" element={<Interact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
