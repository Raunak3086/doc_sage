import React, { useState } from 'react';
import SkeletonLoader from './SkeletonLoader';
import './DocumentSideMenu.css';

const DocumentSideMenu = ({
  documents = [],
  activeDocId,
  onDocumentSelect,
  onAddNewDocument,
  onDocumentDelete,
  onDocumentRename,
  isLoadingDocs,
  docsError,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (e, docId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDocumentDelete(docId);
    }
  };

  const handleRenameClick = (e, doc) => {
    e.stopPropagation();
    setRenamingId(doc.id);
    setDraftName(doc.name);
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (draftName.trim()) {
      onDocumentRename(renamingId, draftName);
    }
    setRenamingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setRenamingId(null);
  };

  return (
    <div className={`document-side-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleCollapse} className="collapse-btn">
        {isCollapsed ? '»' : '«'}
      </button>
      {!isCollapsed && (
        <>
          <div className="document-list">
            <div className="document-list-header">
              <h2>Documents</h2>
            </div>
            {isLoadingDocs ? (
              <div className="skeleton-list">
                <SkeletonLoader className="skeleton-item" count={6} />
              </div>
            ) : docsError ? (
              <p className="error-message">{docsError}</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="search-bar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredDocuments.length > 0 ? (
                  <ul>
                    {filteredDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className={`document-item ${doc.id === activeDocId ? 'active' : ''}`}
                        onClick={() => (renamingId !== doc.id ? onDocumentSelect(doc) : null)}
                      >
                        {renamingId === doc.id ? (
                          <div className="rename-container">
                            <input
                              type="text"
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <button onClick={handleSaveRename} className="doc-action-btn">Save</button>
                            <button onClick={handleCancelRename} className="doc-action-btn delete">Cancel</button>
                          </div>
                        ) : (
                          <div className="document-info">
                            <span className="doc-name">{doc.name}</span>
                            <div className="doc-actions">
                              <button onClick={(e) => handleRenameClick(e, doc)} className="doc-action-btn">
                                Rename
                              </button>
                              <button onClick={(e) => handleDelete(e, doc.id)} className="doc-action-btn delete">
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-documents-message">No documents found.</p>
                )}
              </>
            )}
          </div>
          <button className="add-new-document-btn" onClick={onAddNewDocument} disabled={isLoadingDocs || !!docsError}>
            Add New Document
          </button>
        </>
      )}
    </div>
  );
};

export default DocumentSideMenu;


