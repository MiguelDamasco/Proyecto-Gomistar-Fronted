import React from 'react';

const ModalUsername = ({ isOpen, onClose, title, onSave, password, setPassword, username, setUsername }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <label>
          Ingrese contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Ingrese nuevo Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={() => onSave()}>Guardar</button>
      </div>
    </div>
  );
};

export default ModalUsername;