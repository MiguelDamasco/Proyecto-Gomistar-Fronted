import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import NavBar from "./../NavBarComponent";
import { useNavigate, Link, NavLink } from 'react-router-dom';
import "./../../css/NavBar.css";
import "./../../css/General.css";
import "./../../css/modal/GenericModal.css";
import CreateUserModal from "./modal/CreateUserModal";
import ModifyUserModal from "./modal/ModifyUserModal";
import DeleteUserModal from "./modal/DeleteUserModal";
import AlertMessage from "../alert/AlertMessage";


const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
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
  const [alert, setAlert] = useState(false)
  const isConfirmed = localStorage.getItem('email_confirm');
  const [emailRoute, setEmailRoute] = useState('/confirmar_email')
  const navigate = useNavigate();
  const tableRef = useRef(null);
  
  const myAPI = "http://localhost:8115";


   useEffect(() => {
          
        if(isConfirmed === "1") {
            setEmailRoute("/confirmado");
        }

          fetchUsers();
      }, [token]);


        const showSuccessMessage = (myMessage) => {
          setAlert({ message: myMessage, type: "success" });
          setTimeout(() => setAlert(null), 3000); 

      };
    
      const showError = () => {
        setAlert({ message: "Error al ingresar los datos.", type: "error" });
        setTimeout(() => setAlert(null), 3000);
      };

      const viewTable = () => {
        setTimeout(() => {
          if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 250);
      }
      

    const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        noRowsPerPage: false,
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

  const closeModalEdit = () => {
    fetchUsers();
    setShowEditForm(false);
  }

  const openModalRemove = (user) => {
    setSelectedUser(user);
    setShowRemoveForm(true);
  }

  const closeModalRemove = () => {
    fetchUsers();
    setShowRemoveForm(false);
  }

  const fetchUsers = async () => {
    if (!token) {
        console.error('Faltan valores requeridos (idUser o token)');
        return;
    }

    try {
        const response = await axios.get(
            `${myAPI}/user/list_users`,
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
                  e.stopPropagation();
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
                  e.stopPropagation();
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
    <div className="navegation-container">
        <div className="navegation-main-container">
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active">Crear Usuario</NavLink>
      
      </div>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <svg id="gear-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
        </svg>
        </button>

        <ul class="dropdown-menu">
            <li><span class="dropdown-header">Configuración</span></li>
            <li><hr class="dropdown-divider"/></li>
            <li><a class="dropdown-item" href={emailRoute}>Confirmar email</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
</div>
   </div>
    
    <div className="main-container">
        <div className="title-container">
            <h1>Gestión Usuarios</h1>
        </div>
        <div className="body-container">
            <button type="button" className="btn btn-primary" onClick={openModalAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
</svg>
        &nbsp;Nuevo Usuario</button>
        </div>
    </div>
    <div ref={tableRef} className="table-container">
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
    </div>
{alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

{showAddForm && <CreateUserModal
    closeModal={closeModalAdd}
    token={token}
    succesMessage={showSuccessMessage}
    problemMessage={showError}
    view={viewTable}
    />}

{showEditForm && <ModifyUserModal
    closeModal={closeModalEdit}
    token={token}
    userToModify={selectedUser}
    modifyMessage={showSuccessMessage}
    />}

{showRemoveForm && <DeleteUserModal
    closeModal={closeModalRemove}
    token={token}
    userToDelete={selectedUser}
    deleteMessage={showSuccessMessage}
    />}
    
    </>
  );
};

export default CreateUser;