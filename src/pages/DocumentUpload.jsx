import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentUpload.css';

function DocumentUpload({ onUploadSuccess }) { // Accept onUploadSuccess prop
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      if (onUploadSuccess) {
        onUploadSuccess(selectedFile); // Call the callback if it exists
      } else {
        // Fallback to old navigation logic
        navigate('/interact', { state: { uploadedFile: selectedFile } });
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="document-upload-container">
      <h1>Document Upload</h1>
      <p>Select a file to begin.</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>Upload</button>
    </div>
  );
}

export default DocumentUpload;
