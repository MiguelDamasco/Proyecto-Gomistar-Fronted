import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, onSave, currentValue }) => {
  const [newValue, setNewValue] = useState(currentValue);

  // Sincronizar newValue con currentValue cuando currentValue cambie
  useEffect(() => {
    if (isOpen) {
      setNewValue(currentValue);
    }
  }, [currentValue, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <span>{title}</span>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Escribe aquí el nuevo valor"
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="save-btn" onClick={() => onSave(newValue)}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;

