import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import NavBar from "./../NavBarComponent";
import { useNavigate, Link, NavLink } from 'react-router-dom';
import "./../../css/NavBar.css";
import "./../../css/General.css";
import "./../../css/modal/GenericModal.css";
import CreateUserModal from "./modal/CreateUserModal";


const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    lastname: "",
    roles: [],
  });
  const username = localStorage.getItem('username');
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


   useEffect(() => {
          // Obtener tipos de carga desde la API
  
          fetchUsers();
      }, [token]);


    const paginationOptions = {
        rowsPerPageText: "Filas por página", // Cambia "Rows per page"
        rangeSeparatorText: "de", // Cambia "of"
        noRowsPerPage: false, // Muestra u oculta el selector de filas por página
        selectAllRowsItem: false,
      };
  

 const openModalAdd = () => {
    setShowAddForm(true);
 }

 const closeModalAdd = () => {
    fetchUsers();
    setShowAddForm(false);
 }

  const openModalEdit = (user) => {
    setSelectedUser(user);
    setShowEditForm(true);
  }

  const openModalRemove = (user) => {
    setSelectedUser(user);
    setShowRemoveForm(true);
  }

  const fetchUsers = async () => {
    if (!token) {
        console.error('Faltan valores requeridos (idUser o token)');
        return;
    }

    try {
        const response = await axios.get(
            "http://localhost:8115/user/list_users",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const formattedUsers = response.data.value.map((user) => ({
            id: user.id,
            name: user.fullname,
            email: user.email,
            username: user.username,
            role: user.role,
          }));
  
          setUsers(formattedUsers);
          console.log("usuarios: " + users);
    } catch (error) {
        console.error('Error al obtener la cantidad de alertas:', error);
        localStorage.clear();
        navigate("/login");
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
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      wrap: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
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
      name: "Rol",
      selector: (row) => row.role,
      sortable: true,
      wrap: true,
    },
    {
        name: "Acciones",
        cell: (row) => (
          <>
            <button
              className="btn btn-edit"
              onClick={(e) => {
                  e.stopPropagation(); // Detener la propagación del evento
                  openModalEdit(row);
                }}
              style={{ marginRight: "5px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                   <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
            </button>
            <button
              className="btn btn-delete"
              onClick={(e) => {
                  e.stopPropagation(); // Detener la propagación del evento
                  openModalRemove(row);
                }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
              </svg>
            </button>
          </>
        ),
        width: "200px",
      },
  ];


  return (
    <>
    <NavBar myUser={username}></NavBar>
    <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active">Crear Usuario</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    
    <div className="main-container">
        <div className="title-container">
            <h1>Gestión Usuarios</h1>
        </div>
        <div className="body-container">
            <button type="button" onClick={openModalAdd}>Nuevo Usuario</button>
        </div>
    </div>
      <DataTable
        title=""
        columns={columns}
        data={users}
        pagination
        responsive
        striped
        highlightOnHover
        noDataComponent={<div style={{ textAlign: 'center', padding: '10px' }}>No hay información que mostrar</div>}
        paginationComponentOptions={paginationOptions}
      />

{showAddForm && <CreateUserModal
    closeModal={closeModalAdd}
    token={token}
    />}
    </>
  );
};

export default CreateUser;