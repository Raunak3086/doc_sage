import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentUpload.css';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for upload
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true);
      console.log('Uploading file:', selectedFile);

      // Simulate API call for upload
      setTimeout(() => {
        const simulatedDocId = `doc_${Date.now()}`; // Create a fake docId
        console.log('Upload complete. Doc ID:', simulatedDocId);
        setIsLoading(false);
        // Navigate to interact page with the new docId
        navigate('/interact', { state: { docId: simulatedDocId, docName: selectedFile.name } });
      }, 2000); // Simulate 2-second upload
    }
  };

  return (
    <div className="document-upload-container">
      <h1>Document Upload</h1>
      <p>Select a file to begin.</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default DocumentUpload;
