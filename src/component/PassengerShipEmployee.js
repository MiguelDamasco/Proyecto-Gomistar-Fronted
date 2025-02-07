import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import ModalAddUsersToPassengerShip from "./modal/ModalAddUsersToPassengerShip";
import ModalRemoveUserPassengerShip from "./modal/ModalRemoveUserPassengerShip";
import axios from 'axios';
import Footer from "./Footer";
import "../css/NavBar.css";
import "../css/CargoShipEmployee.css";


const PassengerShipEmployee = () => {

    const [cargoShips, setCargoShips] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenAdd, setModalIsOpenAdd] = useState(false);
    const [selectedCargoShip, setSelectedCargoShip] = useState('');
    const [userToRemove, setUserToRemove] = useState(null);
    const [emailRoute, setEmailRoute] = useState('/confirmar_email');
    const [alertText, setAlertText] = useState('alerta pendiente');
    const amountAlerts = localStorage.getItem('amount_alerts');
    const isAlertClose = localStorage.getItem('isAlertClose');
    const isConfirmed = localStorage.getItem('email_confirm');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const tableRef = useRef(null);
    const navigate = useNavigate();
    
    const myAPI = "http://localhost:8115";


    useEffect(() => {

        const fetchCargoShips = async () => {
            try { 
                const response = await axios.get(
                    `${myAPI}/Passenger_ship/list`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setCargoShips(response.data.value || []);
            } catch (error) {
                console.error('Error al obtener los barcos de carga:', error);
            }
        };

        fetchCargoShips();
    }, [token]);


    useEffect(() => {
            
      fetchAmountAlerts();
      checkText();
  
      if(isConfirmed === "1") {
          setEmailRoute("/confirmado");
      }
  
    }, [token]);
  
  
    const fetchAmountAlerts = async () => {
      if (!id || !token) {
          console.error('Faltan valores requeridos (id o token)');
          return;
      }
  
      try {
          const response = await axios.get(
              `${myAPI}/user/amount_alerts`,
              {
                  headers: { Authorization: `Bearer ${token}` },
                  params: { pId: id },
              }
          );
  
          localStorage.setItem('amount_alerts', response.data.value);
      } catch (error) {
          console.error('Error al obtener la cantidad de alertas:', error);
          localStorage.clear();
          navigate("/login");
      }
  };
  
  
    const checkText = () => {
  
    if(Number(amountAlerts) > 1) {
      setAlertText('alertas pendientes');
    }
    }
  
    const closeAlert = () => {
    localStorage.setItem('isAlertClose', '1');
    navigate("/cambiar_email");
    }

    const confirmDelete = async () => {
        if (!userToRemove) return;
      
        try { 
          const response = await axios.delete(
            `${myAPI}/Passenger_ship/remove_user`,
            {
              params: { pIdUser: userToRemove.id, pIdShip: selectedCargoShip },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          fetchUsers(selectedCargoShip);
      
          closeModal();
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
        }
      };


    const openModal = (user) => {
        setUserToRemove(user);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setUserToRemove(null);
        fetchUsers(selectedCargoShip);
    };

    const openModalAdd = () => {
        
        setModalIsOpenAdd(true);
    };

    const closeModalAdd = () => {
        setModalIsOpenAdd(false);
        fetchUsers(selectedCargoShip);
    };

    const fetchUsers = async (shipId) => {
        if (!token) {
          console.error("JWT no encontrado");
          return;
        }
      
        if (!shipId) {
          console.error("ID de barco no proporcionada");
          return;
        }
      
        try { 
          const response = await axios.get(
            `${myAPI}/Passenger_ship/get_users`,
            {
              params: { pId: shipId },
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
      

    const handleCargoShipChange = (e) => {
        const shipId = e.target.value;
        setSelectedCargoShip(shipId);
        fetchUsers(shipId);
        viewTable();
      };



      const viewTable = () => {
        setTimeout(() => {
          if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 250);
      }
      
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
                className="btn btn-delete"
                onClick={(e) => {
                    e.stopPropagation();
                    openModal(row);
                  }}
              >
                Remover
              </button>
            </>
          ),
          width: "200px",
        },
      ];


      const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        noRowsPerPage: false,
        selectAllRowsItem: false,
      };


    return (
        <>
    <NavBar myUser={username} ></NavBar>
   <div className="navegation-container">
    <div className="navegation-main-container">
      <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="no-active" to="/gestion_tripulantes">Panel tripulantes</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">tripulantes barco Pasajeros</NavLink>
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
              <li><a class="dropdown-item" href="/cambiar_contraseña">Cambiar contraseña</a></li>
              <li><a class="dropdown-item" href="/cambiar_email">Cambiar email</a></li>
          </ul>
      </div>
   </div>
   {Number(amountAlerts) > 0 && isAlertClose === "0" && <div className="alert-background-container">
    <div className="alert-container">
        <p>Tienes {amountAlerts} {alertText}, revise su correro electrónico</p>
        <button type="button" onClick={closeAlert}>X</button>
    </div>
   </div>}
    <div className="form-main-container">
    <form className="form-content" onSubmit={(e) => e.preventDefault()}>
        <div className="title-container">
            <h1>Empleados por embarcación</h1>
        </div>
        <div className="content-container">
            <select
                                onChange={handleCargoShipChange}
                                value={selectedCargoShip}
                            >
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {cargoShips.map((ship) => (
                                    <option key={ship.id} value={ship.id}>
                                        {ship.name}
                                    </option>
                                ))}
                            </select>
        </div>
        <div className="form-buttons-container">
            <button type="submit" className="btn btn-primary" onClick={openModalAdd}>Ingresar</button>
        </div>
      </form>
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
{modalIsOpen && <ModalRemoveUserPassengerShip
                closeModal={closeModal}
                userToRemove={userToRemove}
                removeUser={confirmDelete}
            />}

{modalIsOpenAdd && <ModalAddUsersToPassengerShip
                closeModal={closeModalAdd}
                shipToAdd={selectedCargoShip}
                fetchUsersShip={fetchUsers}
            />}



  <Footer></Footer>
  </>
    );


}

export default PassengerShipEmployee;