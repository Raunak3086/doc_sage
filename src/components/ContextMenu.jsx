import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, doc, onClose, onRename, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleRename = () => {
    onRename(doc);
    onClose();
  };

  const handleDelete = () => {
    onDelete(doc.id);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="hologram-menu"
      style={{ top: y, left: x }}
    >
      <div className="hologram-glow"></div>
      <div className="menu-grid"></div>
      <ul>
        <li className="menu-item menu-item--rename" onClick={handleRename}>
          <span className="item-icon">✏️</span>
          <span>RENAME CRYSTAL</span>
        </li>
        <li className="menu-item menu-item--delete" onClick={handleDelete}>
          <span className="item-icon">🗑️</span>
          <span>DESTROY DATA</span>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
