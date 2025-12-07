import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DocumentSideMenu from '../components/DocumentSideMenu';
import DocumentUploadModal from '../components/DocumentUploadModal';
import UploadForm from '../components/UploadForm';
import SkeletonLoader from '../components/SkeletonLoader';
import './Interact.css';
import axios from 'axios'; // Import Axios

function Interact({ docs, setDocs, isLoadingDocs, docsError }) {
  const location = useLocation();
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [isLoadingSummarize, setIsLoadingSummarize] = useState(false);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [isLoadingDocumentContent, setIsLoadingDocumentContent] = useState(false);
  const [documentContentError, setDocumentContentError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchDocumentContent = useCallback((id, name) => {
    setIsLoadingDocumentContent(true);
    setDocumentContent('');
    setDocumentContentError(null); // Clear any previous errors
    setSummary('');
    setAnswer('');
    console.log(`Fetching content for docId: ${id}`);

    setTimeout(() => {
      // Simulate random error
      if (Math.random() > 0.8) { // 20% chance of error
        setDocumentContentError(`Failed to load content for "${name}". Please try again.`);
        setDocumentContent('');
      } else {
        setDocumentContent(`This is the simulated content for the document "${name}".
        It could be a long text of the PDF or any other document type.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);
        setDocumentContentError(null);
      }
      setIsLoadingDocumentContent(false);
      console.log('Document content loaded.');
    }, 1500);
  }, []);

  const handleDocumentSelect = useCallback((doc) => {
    if (docsError) return; // Prevent selection if there's a global docs error
    setDocId(doc.id);
    setDocName(doc.name);
    fetchDocumentContent(doc.id, doc.name);
  }, [fetchDocumentContent, docsError]);


  const handleDeleteDocument = (idToDelete) => {
    const updatedDocs = docs.filter((doc) => doc.id !== idToDelete);
    setDocs(updatedDocs);

    // If the active document is the one being deleted
    if (docId === idToDelete) {
      if (updatedDocs.length > 0) {
        // Select the first document in the list
        handleDocumentSelect(updatedDocs[0]);
      }
    } else {
      // No documents left
      setDocId(null);
      setDocName('');
      setDocumentContent('');
      setDocumentContentError(null);
    }
  };

  const handleRenameDocument = (idToRename, newName) => {
    const updatedDocs = docs.map((doc) =>
      doc.id === idToRename ? { ...doc, name: newName } : doc
    );
    setDocs(updatedDocs);

    // If the renamed doc is the active one, update the main title
    if (docId === idToRename) {
      setDocName(newName);
    }
  };

  // Effect to handle navigation from upload or direct URL
  useEffect(() => {
    if (location.state?.docId && location.state?.docName) {
      handleDocumentSelect({ id: location.state.docId, name: location.state.docName });
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location, handleDocumentSelect]);

  // Effect for setting the default document
  useEffect(() => {
    // Only run if there's no selected doc, docs are loaded, and there's no error
    if (!docId && !isLoadingDocs && !docsError && docs && docs.length > 0) {
      handleDocumentSelect(docs[0]);
    }
  }, [docId, docs, isLoadingDocs, docsError, handleDocumentSelect]);

  // Axios API call for summarize
  const handleSummarize = async () => {
    if (!docId) {
      setSummary('No document selected to summarize.');
      return;
    }

    setIsLoadingSummarize(true);
    setSummary('');
    console.log('Requesting summary for docId:', docId);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/summary/${docId}`);
      setSummary(response.data.summary);
      console.log('Summary received:', response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Failed to fetch summary. Please try again.');
    } finally {
      setIsLoadingSummarize(false);
    }
  };

  // Simulated API call for query
  const handleQuery = () => {
    if (!question.trim()) return;
    setIsLoadingQuery(true);
    setAnswer('');
    console.log(`Querying docId ${docId} with question: "${question}"`);

    // This simulates a POST request to /query
    setTimeout(() => {
      const result = `This is a simulated answer to your question: "${question}". Based on the document "${docName}".`;
      setAnswer(result);
      setIsLoadingQuery(false);
      console.log('Answer received.');
    }, 2000); // Simulate 2-second delay
  };

  // --- Conditional Rendering for Interact Page ---
  if (isLoadingDocs) {
    return (
      <div className="interact-container">
        <DocumentSideMenu documents={[]} isLoadingDocs={true} />
        <div className="main-content">
          <SkeletonLoader className="h1-skeleton" />
          <SkeletonLoader className="doc-view-skeleton" />
          <div className="sections-wrapper">
            <SkeletonLoader className="section-skeleton" />
            <SkeletonLoader className="section-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="interact-container">
        <DocumentSideMenu documents={[]} isLoadingDocs={false} docsError={docsError} />
        <div className="main-content interact-centered">
          <p className="error-message">{docsError}</p>
        </div>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="interact-container">
        <DocumentSideMenu
          documents={docs}
          onAddNewDocument={openModal}
          isLoadingDocs={isLoadingDocs}
          docsError={docsError}
        />
        <div className="main-content interact-centered">
          <h1>No Documents</h1>
          <p>Upload a document to get started.</p>
        </div>
        {isModalOpen && (
          <DocumentUploadModal onClose={closeModal}>
            <UploadForm setDocs={setDocs} onClose={closeModal} />
          </DocumentUploadModal>
        )}
      </div>
    );
  }

  // Display specific content or a message if docId is null after initial load
  if (!docId) {
    return (
      <div className="interact-container">
        <DocumentSideMenu
          documents={docs}
          activeDocId={docId}
          onDocumentSelect={handleDocumentSelect}
          onAddNewDocument={openModal}
          onDocumentDelete={handleDeleteDocument}
          onDocumentRename={handleRenameDocument}
          isLoadingDocs={isLoadingDocs}
          docsError={docsError}
        />
        <div className="main-content interact-centered">
          <h1>Select a Document</h1>
          <p>Choose a document from the sidebar to view its content and interact with it.</p>
        </div>
        {isModalOpen && (
          <DocumentUploadModal onClose={closeModal}>
            <UploadForm setDocs={setDocs} onClose={closeModal} />
          </DocumentUploadModal>
        )}
      </div>
    );
  }


  return (
    <div className="interact-container">
      <DocumentSideMenu
        documents={docs}
        activeDocId={docId}
        onDocumentSelect={handleDocumentSelect}
        onAddNewDocument={openModal}
        onDocumentDelete={handleDeleteDocument}
        onDocumentRename={handleRenameDocument}
        isLoadingDocs={isLoadingDocs}
        docsError={docsError}
      />
      <div className="main-content">
        <h1>{docName}</h1>

        <div className="document-view">
          {isLoadingDocumentContent ? (
            <SkeletonLoader style={{ height: '100%', minHeight: '150px' }} />
          ) : documentContentError ? (
            <p className="error-message">{documentContentError}</p>
          ) : (
            <p>{documentContent}</p>
          )}
        </div>

        <div className="sections-wrapper"> {/* New wrapper for horizontal layout */}
          {/* --- Summarize Section --- */}
          <div className="section">
            <h2>SUMMARY</h2>
            <button onClick={handleSummarize} disabled={isLoadingSummarize || isLoadingDocumentContent || !!documentContentError}>
              {isLoadingSummarize ? 'Summarizing...' : 'Summarize'}
            </button>
            <textarea
              readOnly
              value={summary}
              placeholder="Summary will appear here..."
              rows="8"
            />
          </div>

          {/* --- Query Section --- */}
          <div className="section">
            <h2>ASK QUERY</h2>
            <div className="query-box">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the document..."
                disabled={isLoadingQuery || isLoadingDocumentContent || !!documentContentError}
              />
              <button onClick={handleQuery} disabled={!question || isLoadingQuery || isLoadingDocumentContent || !!documentContentError}>
                {isLoadingQuery ? 'Asking...' : 'Ask'}
              </button>
            </div>
            <textarea
              readOnly
              value={answer}
              placeholder="Answer will appear here..."
              rows="8"
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <DocumentUploadModal onClose={closeModal}>
          <UploadForm setDocs={setDocs} onClose={closeModal} />
        </DocumentUploadModal>
      )}
    </div>
  );
}

export default Interact;
