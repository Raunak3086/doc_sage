import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Morphin Grid Boot Sequence
const bootMorphinGrid = () => {
  // Preload Orbitron font for instant theme switching
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // Initialize Morphin Grid matrix
  document.body.classList.add('grid-booting');
  
  // Smooth boot animation
  setTimeout(() => {
    document.body.classList.remove('grid-booting');
    document.body.classList.add('grid-online');
  }, 1200);
};

// Initialize Power Rangers Command Center
const initRangerHQ = () => {
  bootMorphinGrid();
  
  const container = document.getElementById('root');
  if (!container) {
    console.error('Morphin Grid core not found!');
    return;
  }

  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );

  // Post-render optimizations
  if (module.hot) {
    module.hot.accept('./App.jsx', () => {
      const NextApp = require('./App.jsx').default;
      root.render(
        <StrictMode>
          <BrowserRouter>
            <NextApp />
          </BrowserRouter>
        </StrictMode>
      );
    });
  }
};

// Activate Ranger Sequence
initRangerHQ();
