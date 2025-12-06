import React, { useState } from 'react';
import SkeletonLoader from './SkeletonLoader';
import ContextMenu from './ContextMenu';
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
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    doc: null,
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDocumentDelete(docId);
    }
  };

  const handleRenameClick = (doc) => {
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
    <div className={`document-side-menu ${isCollapsed ? 'collapsed' : ''}`} onClick={closeContextMenu}>
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
                        onContextMenu={(e) => handleContextMenu(e, doc)}
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


