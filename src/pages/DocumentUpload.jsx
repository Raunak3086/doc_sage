import React, { useState } from 'react';

function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      // Here you would typically send the file to a server
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div>
      <h1>Document Upload Page</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default DocumentUpload;
