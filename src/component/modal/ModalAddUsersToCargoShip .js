import React, {  useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';


const ModalAddUsersToCargoShip = ({ closeModal, shipToAdd, fetchUsersShip }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersWithoutShip, setUsersWithoutShip] = useState([]);
    const token = localStorage.getItem('token');

    const myAPI = "http://localhost:8115";

    useEffect(() => {
        
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `${myAPI}/user/find_All_Without_Ship`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setUsersWithoutShip(response.data.value);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);


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
                `${myAPI}/cargoShip/add_employees`,
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
    
        } catch (e) {
            console.error("Error al añadir usuarios al barco de carga:", e);
        }
    };


    const handleSelectionChange = (selectedRows) => {
        setSelectedUsers(selectedRows.map(row => row.id));
    };

    const handleAddUsers = () => {
        addUsersToShip();
        setSelectedUsers([]);
        closeModal();
        fetchUsersShip(shipToAdd);
    };

    const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        noRowsPerPage: false,
        selectAllRowsItem: false,
      };

    return (
        <div className="modal-background-container">
            <div className="modal-main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="modal-title-container">
                    <h1>Agregar tripulantes</h1>
                </div>
                <div className="modal-body-container">
                    {usersWithoutShip.length > 0 ? (
                        <DataTable
                            title="Usuarios sin embarcación"
                            columns={columns}
                            data={usersWithoutShip}
                            selectableRows
                            onSelectedRowsChange={({ selectedRows }) => handleSelectionChange(selectedRows)}
                            pagination
                            responsive
                            striped
                            highlightOnHover
                            paginationComponentOptions={paginationOptions}
                        />
                    ) : (
                        <p>No hay usuarios sin embarcación disponibles.</p>
                    )}
                </div>
                <div className="modal-footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={handleAddUsers} id="add-btn" type="button" disabled={selectedUsers.length === 0}>
                        Agregar seleccionados
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddUsersToCargoShip;
