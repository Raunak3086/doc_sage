import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  useEffect(() => {
    // Restore ranger theme from login/register
    const theme = localStorage.getItem('selectedTheme') || 'red';
    document.body.setAttribute('data-theme', theme);
  }, []);

  return (
    <div className="ranger-hq">
      <div className="hq-backdrop"></div>
      <div className="ranger-portal">
        <div className="portal-glow"></div>
        <div className="hq-content">
          <div className="ranger-emblem">⚡</div>
          <h1 className="hq-title">
            MORPHIN GRID HQ
          </h1>
          <p className="hq-subtitle">
            Ranger Command Center Active. 
            <br />
            <span className="grid-status">AI SYSTEMS ONLINE</span>
          </p>
          
          <div className="access-panel">
            <Link to="/login" className="btn btn--primary">
              🔑 RANGER LOGIN
            </Link>
            <Link to="/register" className="btn btn--secondary">
              💎 NEW RECRUIT
            </Link>
          </div>
          
          <div className="mission-brief">
            <div className="mission-line">Mission: Document Analysis</div>
            <div className="mission-line">Status: Grid Ready</div>
            <div className="mission-line">Power Level: Maximum</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
