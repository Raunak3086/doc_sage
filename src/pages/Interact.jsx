import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';  // ✅ Added useNavigate
import DocumentSideMenu from '../components/DocumentSideMenu';
import DocumentUploadModal from '../components/DocumentUploadModal';
import UploadForm from '../components/UploadForm';
import SkeletonLoader from '../components/SkeletonLoader';
import './Interact.css'; // Keep this import for now for non-button styles
import axios from 'axios';

function Interact() {
  const location = useLocation();
  const navigate = useNavigate();  // ✅ Added for logout
  const [userId, setUserId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState(null);
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

  // ✅ NEW: Logout handler
  const handleLogout = () => {
    // Clear user session
    setUserId(null);
    setDocs([]);
    setDocId(null);
    setDocName('');
    setDocumentContent('');
    
    // Clear localStorage theme (optional)
    localStorage.removeItem('selectedTheme');
    
    // Redirect to home
    navigate('/', { replace: true });
  };

  // Theme restoration from login
  useEffect(() => {
    const theme = localStorage.getItem('selectedTheme') || 'red';
    document.body.setAttribute('data-theme', theme);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      setIsLoadingDocs(true);
      axios.get(`https://doc-sage.onrender.com/api/docs/${userId}`)
        .then(response => {
          setDocs(response.data);
          setDocsError(null);
        })
        .catch(error => {
          console.error('Failed to fetch docs', error);
          setDocsError('Failed to fetch documents.');
        })
        .finally(() => {
          setIsLoadingDocs(false);
        });
    }
  }, [userId]);

  const fetchDocumentContent = useCallback(async (id, name) => {
    setIsLoadingDocumentContent(true);
    setDocumentContent('');
    setDocumentContentError(null);
    setSummary('');
    setAnswer('');
    try {
      const response = await axios.get(`https://doc-sage.onrender.com/api/file/${id}`);
      setDocumentContent(response.data.text);
    } catch (error) {
      setDocumentContentError(`Failed to load content for "${name}". Please try again.`);
    } finally {
      setIsLoadingDocumentContent(false);
    }
  }, []);

  const handleDocumentSelect = useCallback((doc) => {
    if (docsError || !doc) return;
    setDocId(doc.id);
    setDocName(doc.name);
    fetchDocumentContent(doc.id, doc.name);
  }, [docsError, fetchDocumentContent]);

  const handleDeleteDocument = async (idToDelete) => {
    try {
      await axios.delete(`https://doc-sage.onrender.com/api/docs/delete/${idToDelete}`);
      const updatedDocs = docs.filter((doc) => doc.id !== idToDelete);
      setDocs(updatedDocs);
      if (docId === idToDelete) {
        if (updatedDocs.length > 0) {
          handleDocumentSelect(updatedDocs[0]);
        } else {
          setDocId(null);
          setDocName('');
          setDocumentContent('');
        }
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleRenameDocument = (idToRename, newName) => {
    const updatedDocs = docs.map((doc) =>
      doc.id === idToRename ? { ...doc, name: newName } : doc
    );
    setDocs(updatedDocs);
    if (docId === idToRename) {
      setDocName(newName);
    }
  };

  useEffect(() => {
    if (location.state?.docId && location.state?.docName) {
      handleDocumentSelect({ id: location.state.docId, name: location.state.docName });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleDocumentSelect]);

  useEffect(() => {
    if (!docId && !isLoadingDocs && !docsError && docs?.length > 0) {
      handleDocumentSelect(docs[0]);
    }
  }, [docId, docs, isLoadingDocs, docsError, handleDocumentSelect]);

  const handleSummarize = async () => {
    if (!docId) return;
    setIsLoadingSummarize(true);
    setSummary('');
    try {
      const response = await axios.get(`https://doc-sage.onrender.com/api/summary/${docId}`);
      setSummary(response.data.summary);
    } catch (error) {
      setSummary('Failed to fetch summary.');
    } finally {
      setIsLoadingSummarize(false);
    }
  };

  const handleQuery = async () => {
    if (!question.trim() || !docId) return;
    setIsLoadingQuery(true);
    setAnswer('');
    try {
      const response = await axios.post('https://doc-sage.onrender.com/api/query', { docId, question });
      setAnswer(response.data.answer);
      setQuestion('');
    } catch (error) {
      setAnswer('Failed to get answer.');
    } finally {
      setIsLoadingQuery(false);
    }
  };

  // Loading state - Morphin Grid initializing
  if (isLoadingDocs) {
    return (
      <div className="morphin-grid">
        <div className="grid-sidebar">
          <div className="grid-title">📡 RANGER DATA ARCHIVE</div>
          <div className="loading-status">Initializing Morphin Grid...</div>
        </div>
        <main className="grid-command-center">
          <div className="scanline-animation"></div>
          <div className="loading-hologram">
            <div className="hologram-core"></div>
            <div className="hologram-text">SYNCING WITH GRID...</div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (docsError) {
    return (
      <div className="morphin-grid">
        <div className="grid-sidebar">
          <div className="grid-title">📡 RANGER DATA ARCHIVE</div>
          <div className="error-status">{docsError}</div>
          <button className="btn btn--secondary" onClick={openModal}>
            🔄 RESYNC GRID
          </button>
        </div>
        <main className="grid-command-center">
          <div className="error-display">
            <div className="error-icon">⚠️</div>
            <h2>GRID CONNECTION LOST</h2>
            <p>Upload a data crystal to restore connection</p>
          </div>
        </main>
      </div>
    );
  }

  // No documents
  if (docs.length === 0) {
    return (
      <>
        <div className="morphin-grid">
          <div className="grid-sidebar">
            <div className="grid-title">📡 RANGER DATA ARCHIVE</div>
            <button className="btn btn--secondary" onClick={openModal}>
              💎 UPLOAD DATA CRYSTAL
            </button>
            <div className="empty-archive">No ranger data crystals detected</div>
          </div>
          <main className="grid-command-center">
            <div className="empty-state">
              <div className="morphin-symbol">⚡</div>
              <h1>GRID READY FOR DATA</h1>
              <p>Upload your first data crystal to activate AI analysis</p>
            </div>
          </main>
        </div>
        {isModalOpen && (
          <DocumentUploadModal onClose={closeModal}>
            <UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} />
          </DocumentUploadModal>
        )}
      </>
    );
  }

  // No doc selected
  if (!docId) {
    return (
      <>
        <div className="morphin-grid">
          <div className="grid-sidebar">
            <div className="grid-title">📡 RANGER DATA ARCHIVE</div>
            <button className="btn btn--secondary" onClick={openModal}>
              💎 UPLOAD DATA CRYSTAL
            </button>
          </div>
          <main className="grid-command-center">
            <div className="empty-state">
              <div className="ranger-symbol">🦸</div>
              <div className="user-id-display">
                <span className="user-id-label">Ranger ID:</span>
                <span className="user-id">{userId}</span>
              </div>
              <h1>SELECT DATA CRYSTAL</h1>
              <p>Choose a crystal from the archive to analyze</p>
            </div>
          </main>
        </div>
        {isModalOpen && (
          <DocumentUploadModal onClose={closeModal}>
            <UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} />
          </DocumentUploadModal>
        )}
      </>
    );
  }

  // Main interface ✅ ADDED LOGOUT BUTTON + USER ID
  return (
    <>
      <div className="morphin-grid">
        <div className="grid-sidebar">
          <div className="grid-title">📡 RANGER DATA ARCHIVE</div>
          {/* ✅ NEW: Ranger ID Display */}
          <div className="ranger-id-section">
            <span className="user-id-label">Ranger ID:</span>
            <span className="user-id">{userId}</span>
          </div>
          <button className="btn btn--secondary" onClick={openModal}>
            💎 UPLOAD DATA CRYSTAL
          </button>
          <DocumentSideMenu
            documents={docs}
            activeDocId={docId}
            onDocumentSelect={handleDocumentSelect}
            onAddNewDocument={openModal}
            onDocumentDelete={handleDeleteDocument}
            onDocumentRename={handleRenameDocument}
          />
        </div>

        <main className="grid-command-center">
          <div className="command-header">
            {/* ✅ NEW: User ID + Logout in Header */}
            <div className="header-left">
              <h1 className="crystal-title">{docName}</h1>
              <div className="user-id-display">
                <span className="user-id-label">ID: {userId}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="status-indicators">
                <span className="status-active">🔴 ONLINE</span>
                <span className="status-scan">SCANNING...</span>
              </div>
              {/* ✅ NEW: Logout Button */}
              <button className="btn btn--danger" onClick={handleLogout}>
                🚪 LOGOUT RANGER
              </button>
            </div>
          </div>

          {/* Data Crystal Viewer */}
          <div className="crystal-viewer">
            {isLoadingDocumentContent ? (
              <div className="crystal-loading">
                <div className="loading-core"></div>
                <div>EXTRACTING CRYSTAL DATA...</div>
              </div>
            ) : documentContentError ? (
              <div className="error-message">
                <div className="error-message__icon">⚠️</div>
                <p>{documentContentError}</p>
              </div>
            ) : (
              <div className="crystal-content">{documentContent}</div>
            )}
          </div>

          {/* AI Command Modules */}
          <div className="ai-modules">
            {/* Morphin Analyzer */}
            <div className="module-card analyzer-module">
              <div className="module-header">
                <div className="module-icon">🔮</div>
                <h3>MORPHIN ANALYZER</h3>
              </div>
              <button 
                className="btn btn--primary" 
                onClick={handleSummarize} 
                disabled={isLoadingSummarize || isLoadingDocumentContent}
              >
                {isLoadingSummarize ? 'ANALYZING...' : 'ACTIVATE ANALYZER'}
              </button>
              <div className="analysis-output">
                {summary || 'Analysis will appear here...'}
              </div>
            </div>

            {/* Zord Query Interface */}
            <div className="module-card query-module">
              <div className="module-header">
                <div className="module-icon">🤖</div>
                <h3>ZORD QUERY INTERFACE</h3>
              </div>
              <div className="query-interface">
                <input
                  type="text"
                  className="query-input"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Query the Zord AI..."
                  disabled={isLoadingQuery || isLoadingDocumentContent}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                />
                <button 
                  className="btn btn--primary" 
                  onClick={handleQuery} 
                  disabled={!question.trim() || isLoadingQuery || isLoadingDocumentContent}
                >
                  {isLoadingQuery ? 'QUERYING...' : 'QUERY ZORD'}
                </button>
              </div>
              <div className="query-output">
                {answer || 'Zord AI response will appear here...'}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isModalOpen && (
        <DocumentUploadModal onClose={closeModal}>
          <UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} />
        </DocumentUploadModal>
      )}
    </>
  );
}

export default Interact;
