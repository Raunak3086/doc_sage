import React from 'react';
import './DocumentUploadModal.css';

function DocumentUploadModal({ children, onClose }) {
  return (
    <div className="morphin-portal" onClick={onClose}>
      <div className="portal-overlay"></div>
      <div 
        className="portal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="portal-glow"></div>
        <button className="portal-close" onClick={onClose}>
          <span className="close-scanline"></span>
          <span>✕</span>
        </button>
        <div className="portal-header">
          <div className="portal-orb">💎</div>
          <h2>DATA CRYSTAL PORTAL</h2>
        </div>
        <div className="portal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadModal;
