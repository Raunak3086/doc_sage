import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './uploadForm.css';

function UploadForm({ setDocs, userId, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Select a data crystal first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create FormData and append file (SAME functionality)
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId);

      // POST to backend (SAME endpoint)
      const res = await axios.post('https://doc-sage.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { docId } = res.data;
      const newDoc = { 
        id: docId, 
        name: selectedFile.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // SAME array handling logic
      setDocs((currentDocs) => {
        if (!Array.isArray(currentDocs)) {
          console.warn('currentDocs is not an array:', currentDocs);
          return [newDoc];
        }
        return [newDoc, ...currentDocs];
      });

      setIsLoading(false);
      setSelectedFile(null);
      
      if (onClose) onClose();

      // SAME navigation behavior
      navigate('/interact', { 
        state: { 
          docId: newDoc.id, 
          docName: newDoc.name 
        } 
      });
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Crystal upload failed';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    if (onClose) onClose();
  };

  return (
    <div className="crystal-uploader">
      <div className="crystal-container">
        {/* Header */}
        <div className="crystal-header">
          <div className="crystal-orb">💎</div>
          <h1 className="crystal-title">DATA CRYSTAL UPLOADER</h1>
          <p className="crystal-subtitle">Insert ranger intelligence into Morphin Grid</p>
        </div>

        {/* Status */}
        {error && (
          <div className="crystal-alert crystal-alert--error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {selectedFile && (
          <div className="crystal-preview">
            <div className="preview-glow"></div>
            <div className="preview-content">
              <span className="preview-icon">✅</span>
              <div className="preview-info">
                <strong className="preview-name">{selectedFile.name}</strong>
                <span className="preview-size">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="file-dropzone">
          <input 
            type="file" 
            id="crystal-input"
            onChange={handleFileChange}
            disabled={isLoading}
            accept=".pdf,.doc,.docx,.txt,.pptx"
            className="file-input"
          />
          <label htmlFor="crystal-input" className="dropzone-label">
            {selectedFile ? 'Change Crystal' : 'Drag Data Crystal Here\nor Click to Select'}
          </label>
        </div>

        {/* Controls */}
        <div className="crystal-controls">
          <button 
            className="control-btn control-btn--upload"
            onClick={handleUpload} 
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <span className="crystal-spinner"></span>
                CRYSTALIZING...
              </>
            ) : (
              'INSERT INTO GRID'
            )}
          </button>
          <button 
            className="control-btn control-btn--cancel"
            onClick={handleCancel}
            disabled={isLoading}
          >
            ABORT UPLOAD
          </button>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="crystal-progress">
            <div className="progress-glow"></div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Syncing with Morphin Grid...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadForm;
