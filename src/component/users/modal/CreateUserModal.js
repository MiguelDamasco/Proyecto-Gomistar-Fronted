import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateUserModal = ({ closeModal, token, succesMessage, problemMessage, view }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    roles: [],
  });

  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myApi = "http://localhost:8115";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


  useEffect(() => {
    // Obtener lista de roles desde la API
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${myApi}/role/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.value) {
          setRoles(response.data.value);

          if (response.data.value.length > 0) {
            setFormData((prevData) => ({
              ...prevData,
              roles: [response.data.value[0].id.toString()],
            }));
          }
        }
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, [token]);


  const handleInputChange = (e) => {

    const { name, value } = e.target;
  
    if (name === "username" && !/^[a-zA-Z0-9]*$/.test(value)) {
        return; // No permite actualizar el estado si el valor contiene caracteres no permitidos
      }

    if ((name === "name" || name === "lastname") && !/^[A-Za-z\s]*$/.test(value)) {
      return;
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
        const usernameResponse = await axios.get(`${myApi}/user/check_username`, {
          params: { pUsername: formData.username },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }
    catch(error) {
        setUsernameError("El nombre de usuario ya está en uso.");
        setIsSubmitting(false);
        problemMessage();
    }
  }

  const checkEmail = async () => {

    try {
        const emailResponse = await axios.get(`${myApi}/user/check_email`, {
            params: { pEmail: formData.email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    }
    catch(error) {
        setEmailError("El correo electrónico ya está en uso.");
        setIsSubmitting(false);
        problemMessage();
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      problemMessage();
      return;
    }
  
    if (!emailRegex.test(formData.email)) {
      setEmailError("El correo electrónico no es válido.");
      problemMessage();
      return;
    }
  
    if (formData.password.length < 8) {
      setPasswordError(true);
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      problemMessage();
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await checkUsername();
      await checkEmail();
  
      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        lastname: formData.lastname,
        roles: roles
          .filter((role) => formData.roles.includes(role.id.toString()))
          .map((role) => role.name),
      };
  
      const response = await axios.post(`${myApi}/user/create`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      closeModal();
      succesMessage(response.data.message);
      view();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrorMessage(
        error.response?.data?.message || "Ocurrió un error al crear el usuario."
      );
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
              maxLength={50}
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
        <div className="modal-field-container">
                    <label>Roles:</label>
                    <select name="roles" value={formData.roles} onChange={handleInputChange} className="input" required>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                        {role.name}
                        </option>
                    ))}
                    </select>
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




