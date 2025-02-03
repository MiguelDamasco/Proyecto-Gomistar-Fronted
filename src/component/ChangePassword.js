import React, { useState } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink } from 'react-router-dom';
import axios from "axios";
import "../css/NavBar.css";
import "../css/General.css";

const ChangePassword = () => {
  const username = localStorage.getItem('username');
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    setError("");
    setMessage("");

    // Validar que el nuevo password y la confirmación coincidan
    if (newPassword !== confirmNewPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      // Primero, verificar que la contraseña actual sea correcta
      const checkResponse = await axios.post(
        "http://localhost:8115/user/checkPassword",
        {
          idUser: id,
          password: currentPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!checkResponse.data.data) {
        setError("La contraseña actual es incorrecta.");
        return;
      }

      // Si la contraseña actual es correcta, proceder a cambiarla
      const changeResponse = await axios.patch(
        "http://localhost:8115/user/change_password",
        {
          idUser: id,
          password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(changeResponse.data.message || "¡Contraseña cambiada correctamente!");
      // Puedes redireccionar o limpiar los campos si es necesario.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al intentar cambiar la contraseña.");
    }
  };

  return (
    <>
      <NavBar myUser={username} />
      <div className='navegation-container'>
        <div className="navegation-main-container">
          <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
          <p className="separator">&gt;</p>
          <NavLink className="no-active" to="/barcos">Cambiar Email</NavLink>
        </div>
      </div>
      <div className="main-container">
        <div className="title-container">
          <h1>Cambiar Contraseña</h1>
        </div>
        <div className="body-container">
          <div className="input-container">
            <input
              type="password"
              placeholder="Ingrese contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Ingrese nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Confirme nueva contraseña"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="button-container">
            <button type="button" onClick={handleSubmit}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
