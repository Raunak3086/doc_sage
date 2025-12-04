import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DocumentUpload.css';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      // Placeholder for actual upload logic
      
      // Navigate to the new page after "upload"
      navigate('/interact', { state: { uploadedFile: selectedFile } });
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
