import React from 'react';

const ModalPassword = ({ isOpen, onClose, title, onSave, oldPassword, setOldPassword, newPassword, setNewPassword }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <label>
          Contraseña vieja:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <label>
          Nueva contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={() => onSave()}>Guardar</button>
      </div>
    </div>
  );
};

export default ModalPassword;
