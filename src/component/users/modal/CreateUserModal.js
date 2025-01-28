import React, { useState } from "react";
import axios from "axios";

const CreateUserModal = ({ closeModal, token }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Validar solo letras y espacios en name y lastname
    if ((name === "name" || name === "lastname") && !/^[A-Za-z\s]*$/.test(value)) {
      return; // No actualiza el estado si el valor no es válido
    }
  
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Limpiar errores al editar
    if (name === "username") setUsernameError("");
    if (name === "email") setEmailError("");
    if (name === "password" || name === "confirmPassword") setPasswordError(false);
  };
  

  const checkUsername = async () => {

    try {
        // Validar username
        const usernameResponse = await axios.get("http://localhost:8115/user/check_username", {
          params: { pUsername: formData.username },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }
    catch(error) {
        setUsernameError("El nombre de usuario ya está en uso.");
        setIsSubmitting(false);
    }
  }

  const checkEmail = async () => {

    try {
        // Validar username
        const emailResponse = await axios.get("http://localhost:8115/user/check_email", {
            params: { pEmail: formData.email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    }
    catch(error) {
        setEmailError("El correo electrónico ya está en uso.");
        setIsSubmitting(false);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      return;
    }

    if (!emailRegex.test(formData.email)) {
        setEmailError("El correo electrónico no es válido.");
        return;
    }

    if (formData.password.length < 8) {
        setPasswordError(true);
        setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    setIsSubmitting(true);

    try {
        checkUsername();
        checkEmail();

      
      //closeModal();
    } catch (error) {
      console.error("Error al verificar los datos:", error);
      alert("Ocurrió un error al verificar los datos. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-background-container">
      <div className="modal-main-container">
        <div className="close-button">
          <button onClick={closeModal}>X</button>
        </div>
        <div className="modal-title-container">
          <h1>Crear Usuario</h1>
        </div>
        <form onSubmit={handleSubmit} className="modal-body-container">
          <div className="modal-field-container">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input ${usernameError ? "input-error" : ""}`}
              maxLength={25}
              required
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
          </div>
          <div className="modal-field-container">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${emailError ? "input-error" : ""}`}
              maxLength={25}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="modal-field-container">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input"
              maxLength={15}
              required
            />
          </div>
          <div className="modal-field-container">
            <label>Apellido:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="input"
              maxLength={15}
              required
            />
          </div>
          <div className="modal-field-container">
  <label>Contraseña:</label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    className={`input ${passwordError ? "input-error" : ""}`}
    maxLength={65}
    required
  />
</div>
<div className="modal-field-container">
  <label>Confirmar Contraseña:</label>
  <input
    type="password"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleInputChange}
    className={`input ${passwordError ? "input-error" : ""}`}
    maxLength={65}
    required
  />
  {passwordError && (
    <p className="error-message">
      {errorMessage || "Las contraseñas no coinciden."}
    </p>
  )}
</div>
          <div className="modal-footer-container">
            <button type="button" onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verificando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;




