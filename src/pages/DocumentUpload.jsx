import React from 'react';
import UploadForm from '../components/UploadForm';
import './DocumentUpload.css';

function DocumentUpload({ setDocs }) {
  // The DocumentUpload page now acts as a container for the reusable UploadForm.
  // It can have its own styling and layout.
  return (
    <div className="document-upload-container">
      <UploadForm setDocs={setDocs} />
    </div>
  );
}

export default DocumentUpload;
