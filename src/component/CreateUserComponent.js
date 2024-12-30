import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import ModalForm from "./modal/ModalForm";
import CreateUserForm from "./CreateUserForm";
import NavBar from "./NavBarComponent";
import { useNavigate, Link, NavLink } from 'react-router-dom';
import "../css/MyTable.css";
import "../css/CreateUserForm.css";
import "../css/NavegationDir.css";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const myUsername = localStorage.getItem("username");
    setUsername(myUsername);
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT no encontrado");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8115/userEmployee/listUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedUsers = response.data.value.map((user) => ({
          id: user.idUser,
          name: user.name,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  // Función para eliminar usuario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8115/userEmployee/delete`, {
        params: { pId: id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("Usuario eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar el usuario.");
    }
  };

  // Función para abrir el modal de modificar
  const handleEdit = (user) => {
    console.log("Editing user:", user);
    setSelectedUser(user);
    setShowEditForm(true);
  };

  // Función para guardar cambios del modal
  const handleSave = async (updatedUser) => {
    try {
      await axios.put(
        "http://localhost:8115/userEmployee/modify_user",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowEditForm(false);
      alert("Usuario modificado con éxito.");
      // Actualizar la tabla
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...updatedUser } : user
        )
      );
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      alert("Error al modificar el usuario.");
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.lastname,
      sortable: true,
      wrap: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="btn btn-edit"
            onClick={() => handleEdit(row)}
            style={{ marginRight: "5px" }}
          >
            Modificar
          </button>
          <button
            className="btn btn-delete"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </button>
        </>
      ),
      width: "200px",
    },
  ];

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    lastname: "",
    roles: [], // Si quieres soporte para múltiples roles, usa un array aquí
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: [value], // Para selección única. Para múltiple, ajusta esta lógica.
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8115/userEmployee/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al crear el usuario");
      setMessage("");
    }
  };


  return (
    <>
    <NavBar myUser={username}></NavBar>
    <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active">Crear Usuario</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div style={{ padding: "1rem" }}>
     <div className="create-user-form">
     <h1>Crear Usuario</h1>

{message && <div className="alert alert-success">{message}</div>}
{error && <div className="alert alert-danger">{error}</div>}

<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="username">Username</label>
    <input
      type="text"
      id="username"
      name="username"
      value={formData.username}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="name">Nombre</label>
    <input
      type="text"
      id="name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="lastname">Apellido</label>
    <input
      type="text"
      id="lastname"
      name="lastname"
      value={formData.lastname}
      onChange={handleChange}
      className="form-control"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="roles">Rol</label>
    <select
      id="roles"
      name="roles"
      value={formData.roles[0] || ""} // Selección única
      onChange={handleRoleChange}
      className="form-control"
      required
    >
      <option value="" disabled>
        Selecciona un rol
      </option>
      <option value="ADMIN">Admin</option>
      <option value="USER">User</option>
    </select>
  </div>

  <button type="submit" className="btn btn-primary">
    Crear Usuario
  </button>
</form>
      </div> 
      <h1>React Data Table Example</h1>
      <DataTable
        title="User Data"
        columns={columns}
        data={users}
        pagination
        responsive
        striped
        highlightOnHover
      />

      {/* Modal para modificar usuario */}
      <ModalForm
        show={showEditForm}
        user={selectedUser}
        onHide={() => setShowEditForm(false)}
        onSave={handleSave}
      />
    </div>
    </>
  );
};

export default CreateUser;
