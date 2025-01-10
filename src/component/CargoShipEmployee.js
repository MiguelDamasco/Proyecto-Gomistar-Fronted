import React, { useState, useEffect } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import ModalRemoveUserCargoShip from "./modal/ModalDeleteUserCargoShip";
import ModalAddUsersToCargoShip from "./modal/ModalAddUsersToCargoShip ";
import axios from 'axios';
import "../css/NavBar.css";
import "../css/CargoShipEmployee.css";


const CargoShipEmployee = () => {

    const [cargoShips, setCargoShips] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenAdd, setModalIsOpenAdd] = useState(false);
    const [selectedCargoShip, setSelectedCargoShip] = useState('');
    const [userToRemove, setUserToRemove] = useState(null);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');


    useEffect(() => {
        // Obtener tipos de carga desde la API
        const fetchCargoShips = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8115/cargoShip/listAll",
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

    const confirmDelete = async () => {
        if (!userToRemove) return;
      
        console.log("id usuario a eliminar: " + userToRemove.id);
        console.log("id barco a eliminar usuario: " + selectedCargoShip);
      
        try {
          const response = await axios.delete(
            "http://localhost:8115/cargoShip/remove_user",
            {
              params: { pIdUser: userToRemove.id, pIdShip: selectedCargoShip },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          console.log(response.data.message);
      
          // Actualizar la lista de usuarios después de la eliminación
          fetchUsers(selectedCargoShip);
      
          closeModal(); // Cierra el modal
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
            `http://localhost:8115/cargoShip/get_users`,
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
        const shipId = e.target.value; // Obtén el ID seleccionado
        setSelectedCargoShip(shipId);
        console.log("id barco: " + shipId);
        fetchUsers(shipId); // Pasa el ID directamente
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
                className="btn btn-delete"
                onClick={(e) => {
                    e.stopPropagation(); // Detener la propagación del evento
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

      const handleDelete = (user) => {
        console.log("eliminado: " + user);
      } 

    return (
        <>
    <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="no-active" to="/gestion_tripulantes">Panel tripulantes</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">tripulantes barco carga</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div className="selector-container">
        <div className="title-container">
            <h1>Empleados por embarcación</h1>
        </div>
        <div className="content-container">
            <label>Embarcación:</label>
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
        <div className="footer-container">
            <button type="submit" className="btn btn-primary" onClick={openModalAdd}>Ingresar</button>
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
      />

{modalIsOpen && <ModalRemoveUserCargoShip
                closeModal={closeModal}
                userToRemove={userToRemove}
                removeUser={confirmDelete}
            />}

{modalIsOpenAdd && <ModalAddUsersToCargoShip
                closeModal={closeModalAdd}
                shipToAdd={selectedCargoShip}
                fetchUsersShip={fetchUsers}
            />}
  </>
    );


}

export default CargoShipEmployee;