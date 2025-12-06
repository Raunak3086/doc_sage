import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/DocumentUpload.css'; // We can reuse the same CSS

function UploadForm({ setDocs, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true);
      console.log('Uploading file:', selectedFile);
      console.log(`Creating directory for ${selectedFile.name}...`);

      // Simulate API call for upload
      setTimeout(() => {
        const simulatedDocId = `doc_${Date.now()}`;
        const newDoc = { id: simulatedDocId, name: selectedFile.name };

        console.log('Upload complete. Doc ID:', simulatedDocId);
        
        // Add the new document to the list in the parent state
        setDocs(currentDocs => [newDoc, ...currentDocs]);
        
        setIsLoading(false);
        if (onClose) onClose(); // Close the modal on success
        
        // Navigate to interact page with the new docId
        navigate('/interact', { state: { docId: newDoc.id, docName: newDoc.name } });
      }, 2000);
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
