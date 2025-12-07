import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interact from './pages/Interact';
import DocumentUpload from './pages/DocumentUpload';
import Login from './pages/Login';        
import Register from './pages/Register';  
import './App.css';

function App() {
  const [docs, setDocs] = useState(() => {
    try {
      const savedDocs = localStorage.getItem('docs');
      return savedDocs ? JSON.parse(savedDocs) : [];
    } catch (error) {
      console.error("Error reading docs from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('docs', JSON.stringify(docs));
    } catch (error) {
      console.error("Error saving docs to localStorage", error);
    }
  }, [docs]);

  const isLoadingDocs = false;
  const docsError = null;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home setDocs={setDocs} />} />
        <Route path="/upload" element={<DocumentUpload setDocs={setDocs} />} />
        <Route
          path="/interact"
          element={
            <Interact
              docs={docs}
              setDocs={setDocs}
              isLoadingDocs={isLoadingDocs}
              docsError={docsError}
            />
          }
        />

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </>
  );
}

export default App;
