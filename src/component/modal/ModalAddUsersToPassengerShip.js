import React, {  useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';


const ModalAddUsersToPassengerShip = ({ closeModal, shipToAdd, fetchUsersShip }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersWithoutShip, setUsersWithoutShip] = useState([]);
    const token = localStorage.getItem('token');


    useEffect(() => {
        // Función para obtener datos de la API
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8115/user/find_All_Without_Ship",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setUsersWithoutShip(response.data.value); // Suponiendo que el backend devuelve un array de barcos
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
        console.log("Cargas: " + usersWithoutShip);
    }, []);





    // Configuración de columnas para DataTable
    const columns = [
        {
            name: "Username",
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
    ];


    const addUsersToShip = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8115/Passenger_ship/add_employees",
                {
                    id: shipToAdd,
                    usersList: selectedUsers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Usuarios agregados exitosamente:", selectedUsers);
            console.log("Respuesta del servidor:", response.data);
        } catch (e) {
            console.error("Error al añadir usuarios al barco de carga:", e);
        }
    };
    // Opciones de selección en DataTable
    const handleSelectionChange = (selectedRows) => {
        setSelectedUsers(selectedRows.map(row => row.id)); // Extrae solo los IDs seleccionados
    };

    const handleAddUsers = () => {
        addUsersToShip();
        console.log("usuarios seleccionados: " + selectedUsers);
        setSelectedUsers([]); // Limpia las selecciones después de agregar
        closeModal(); // Cierra el modal
        fetchUsersShip(shipToAdd);
    };

    return (
        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Agregar tripulantes</h1>
                </div>
                <div className="body-container">
                    {usersWithoutShip.length > 0 ? (
                        <DataTable
                            title="Usuarios sin embarcación"
                            columns={columns}
                            data={usersWithoutShip}
                            selectableRows
                            onSelectedRowsChange={({ selectedRows }) => handleSelectionChange(selectedRows)}
                            pagination
                        />
                    ) : (
                        <p>No hay usuarios sin embarcación disponibles.</p>
                    )}
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={handleAddUsers} id="add-btn" type="button" disabled={selectedUsers.length === 0}>
                        Agregar seleccionados
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddUsersToPassengerShip;
