import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/DocumentUpload.css';

function UploadForm({ setDocs, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // POST to backend
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { docId } = res.data;
      const newDoc = { id: docId, name: selectedFile.name };

      // Update parent doc list
      setDocs((currentDocs) => [newDoc, ...currentDocs]);

      setIsLoading(false);
      if (onClose) onClose();

      // Navigate to /interact with new doc details
      navigate('/interact', { state: { docId: newDoc.id, docName: newDoc.name } });
    } catch (error) {
      console.error('Upload error:', error);
      setIsLoading(false);
      // Optionally show error UI here
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

export default UploadForm;
