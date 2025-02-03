import React, { useState, useEffect } from "react";
import axios from "axios";

const ModifyUserModal = ({ closeModal, token, userToModify, modifyMessage }) => {
  const [formData, setFormData] = useState({
    id: "",
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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  // Obtener lista de roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8115/role/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.value) {
          setRoles(response.data.value);
        }
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, [token]);

  // Obtener datos del usuario a modificar
  useEffect(() => {
    if (!userToModify?.id) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8115/user/find", {
          params: { pId: userToModify.id },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.value) {
          const user = response.data.value;
          setFormData({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            password: user.password,
            confirmPassword: user.password,
            roles: user.roles.map((role) => role.id.toString()),
          });
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUser();
  }, [userToModify, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" && !/^[a-zA-Z0-9]*$/.test(value)) return;
    if ((name === "name" || name === "lastname") && !/^[A-Za-z\s]*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    if (name === "username") setUsernameError("");
    if (name === "email") setEmailError("");
    if (name === "password" || name === "confirmPassword") setPasswordError(false);
  };

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

    if (formData.password.length > 0 && formData.password.length < 8) {
      setPasswordError(true);
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        id: formData.id,
        username: formData.username,
        password: formData.password || undefined,
        email: formData.email,
        name: formData.name,
        lastname: formData.lastname,
        roles: roles
          .filter((role) => formData.roles.includes(role.id.toString()))
          .map((role) => role.name),
      };

      const response = await axios.put("http://localhost:8115/user/modify", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      closeModal();
      modifyMessage(response.data.message);
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      setErrorMessage(
        error.response?.data?.message || "Ocurrió un error al modificar el usuario."
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
          <h1>Modificar Usuario</h1>
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
              maxLength={30}
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
              maxLength={30}
              required
            />
          </div>
          <div className="modal-field-container">
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input ${passwordError ? "input-error" : ""}`}
              maxLength={65}
            />
          </div>
          <div className="modal-field-container">
            <label>Confirmar Nueva Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input ${passwordError ? "input-error" : ""}`}
              maxLength={65}
            />
            {passwordError && (
              <p className="error-message">
                {errorMessage || "Las contraseñas no coinciden."}
              </p>
            )}
          </div>
          <div className="modal-field-container">
            <label>Roles:</label>
            <select
              name="roles"
              value={formData.roles}
              onChange={handleInputChange}
              className="input"
              required
            >
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
              {isSubmitting ? "Modificando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyUserModal;
