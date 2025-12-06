import React, { useState } from 'react';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DocumentUpload from './DocumentUpload';
import './Home.css';

function Home({ setDocs }) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to DocSage</h1>
        <p>Click the button below to upload a document and start interacting.</p>
        <button onClick={openUploadModal}>Upload Document</button>
      </div>

      {showUploadModal && (
        <DocumentUploadModal onClose={closeUploadModal}>
          <DocumentUpload setDocs={setDocs} />
        </DocumentUploadModal>
      )}
    </div>
  );
}

export default Home;
