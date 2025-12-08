
import React, { useState, useMemo } from 'react';
import SkeletonLoader from './SkeletonLoader';
import ContextMenu from './ContextMenu';
import './DocumentSideMenu.css';

const DocumentSideMenu = ({
  documents ,
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
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    doc: null,
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ✅ FIX 1: Ensure documents is always an array
  const safeDocuments = useMemo(() => {
    // Check if documents is already an array
    if (Array.isArray(documents)) {
      return documents;
    }
    return [];
  }, [documents]);

  // ✅ FIX 2: Filter with proper null/undefined checks
  const filteredDocuments = useMemo(() => {
    if (!Array.isArray(safeDocuments)) {
      return [];
    }

    const searchLower = (searchTerm || '').toLowerCase().trim();

    return safeDocuments.filter((doc) => {
      // Skip null/undefined documents
      if (!doc || typeof doc !== 'object') {
        return false;
      }

      // Safely get document name
      const docName = (doc.name || doc.title || 'Untitled').toLowerCase();

      // Return boolean result of includes check
      return docName.includes(searchLower);
    });
  }, [safeDocuments, searchTerm]);

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDocumentDelete(docId);
    }
  };

  const handleRenameClick = (doc) => {
    setRenamingId(doc.id);
    setDraftName(doc.name || doc.title || 'Untitled');
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (draftName.trim()) {
      onDocumentRename(renamingId, draftName.trim());
    }
    setRenamingId(null);
    setDraftName('');
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setRenamingId(null);
    setDraftName('');
  };

  const handleContextMenu = (e, doc) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      doc: doc,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div 
      className={`document-side-menu ${isCollapsed ? 'collapsed' : ''}`} 
      onClick={closeContextMenu}
    >
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          doc={contextMenu.doc}
          onClose={closeContextMenu}
          onRename={handleRenameClick}
          onDelete={handleDelete}
        />
      )}

      <button onClick={toggleCollapse} className="collapse-btn" aria-label="Toggle sidebar">
        {isCollapsed ? '»' : '«'}
      </button>

      {!isCollapsed && (
        <>
          <div className="document-list">
            <div className="document-list-header">
              <h2>Documents</h2>
              <span className="doc-count">{filteredDocuments.length}</span>
            </div>

            {/* Loading State */}
            {isLoadingDocs ? (
              <div className="skeleton-list">
                <SkeletonLoader className="skeleton-item" count={6} />
              </div>
            ) : docsError ? (
              <div className="error-message-container">
                <p className="error-message">⚠️ {docsError}</p>
              </div>
            ) : safeDocuments.length === 0 ? (
              <p className="no-documents-message">No documents yet. Create one to get started.</p>
            ) : (
              <>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="search-bar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search documents"
                />

                {/* Documents List */}
                {filteredDocuments.length > 0 ? (
                  <ul className="documents-ul">
                    {filteredDocuments.map((doc) => (
                      <li
                        key={doc.id}
                        className={`document-item ${doc.id === activeDocId ? 'active' : ''}`}
                        onClick={() => {
                          if (renamingId !== doc.id) {
                            onDocumentSelect(doc);
                          }
                        }}
                        onContextMenu={(e) => handleContextMenu(e, doc)}
                      >
                        {renamingId === doc.id ? (
                          <div className="rename-container">
                            <input
                              type="text"
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveRename(e);
                                } else if (e.key === 'Escape') {
                                  handleCancelRename(e);
                                }
                              }}
                              autoFocus
                              className="rename-input"
                              aria-label="Document name"
                            />
                            <button 
                              onClick={handleSaveRename} 
                              className="doc-action-btn save"
                              title="Save (Enter)"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={handleCancelRename} 
                              className="doc-action-btn delete"
                              title="Cancel (Esc)"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="document-info">
                            <span className="doc-name" title={doc.name || doc.title}>
                              {doc.name || doc.title || 'Untitled'}
                            </span>
                            {doc.updatedAt && (
                              <span className="doc-date">
                                {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-documents-message">No documents match your search.</p>
                )}
              </>
            )}
          </div>

          <button 
            className="add-new-document-btn" 
            onClick={onAddNewDocument} 
            disabled={isLoadingDocs || !!docsError}
            aria-label="Add new document"
          >
            + Add New Document
          </button>
        </>
      )}
    </div>
  );
};

export default DocumentSideMenu;