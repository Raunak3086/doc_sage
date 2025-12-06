import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DocumentUpload.css';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    setLoading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Upload successful! Document ID: ${response.data.docId}`);
      setSelectedFile(null); // Clear selected file after successful upload
      navigate('/interact', { state: { docId: response.data.docId, filename: selectedFile.name } });
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload-container">
      <h1>Document Upload</h1>
      <p>Select a file to begin.</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !selectedFile}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DocumentUpload;
