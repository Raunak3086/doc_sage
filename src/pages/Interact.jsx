import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DocumentUpload from './DocumentUpload';
import './Interact.css';

function Interact() {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.uploadedFile) {
      const initialDoc = {
        id: Date.now(),
        name: location.state.uploadedFile.name,
        summary: '',
        queries: [],
      };
      setDocuments([initialDoc]);
      setActiveDocumentId(initialDoc.id);
    }
  }, [location.state]);
  
  const getActiveDocument = () => documents.find(doc => doc.id === activeDocumentId);

  const handleSummarize = () => {
    const activeDoc = getActiveDocument();
    if (activeDoc) {
      console.log(`Summarizing ${activeDoc.name}`);
      const updatedDocuments = documents.map(doc =>
        doc.id === activeDocumentId
          ? { ...doc, summary: `This is a placeholder summary for ${activeDoc.name}.` }
          : doc
      );
      setDocuments(updatedDocuments);
    }
  };
  
  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);

  const handleNewDocument = (newFile) => {
    const newDoc = {
      id: Date.now(),
      name: newFile.name,
      summary: '',
      queries: [],
    };
    setDocuments([...documents, newDoc]);
    setActiveDocumentId(newDoc.id);
    closeUploadModal();
  };

  return (
    <div className="interact-container">
      <div className="tab-navbar">
        {documents.map(doc => (
          <button
            key={doc.id}
            className={`tab ${doc.id === activeDocumentId ? 'active' : ''}`}
            onClick={() => setActiveDocumentId(doc.id)}
          >
            {doc.name}
          </button>
        ))}
        <button className="add-doc-button" onClick={openUploadModal}>+</button>
      </div>

      <div className="content-area">
        {getActiveDocument() ? (
          <div>
            <h1>Interacting with: {getActiveDocument().name}</h1>
            <div className="section">
              <h2>1. Summarize</h2>
              <button onClick={handleSummarize}>Summarize</button>
              {getActiveDocument().summary && (
                <div className="result-area summary-result">
                  {getActiveDocument().summary}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-document-message">
            <h1>No document selected</h1>
            <p>Please upload a document to begin.</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <DocumentUploadModal onClose={closeUploadModal}>
          <DocumentUpload onUploadSuccess={handleNewDocument} />
        </DocumentUploadModal>
      )}
    </div>
  );
}

export default Interact;
