import React, { useState, useEffect  } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from "react-data-table-component";
import Modal from 'react-modal';
import "../css/NavBar.css";
import "../css/ShipManagement.css";
import ModalDeleteShip from "./modal/ModalDeleteShip";
import ModalEditShip from "./modal/ModalEditShip";
import "../css/ModalDeleteShip.css";

//Modal.setAppElement('#root');

const ShipManagement = () => {

    const [ships, setShips] = useState([]);
    const [loadTypes, setLoadTypes] = useState([]);
    const [selectedLoadType, setSelectedLoadType] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
    const [shipToDelete, setShipToDelete] = useState(null);
    const [shipToEdit, setShipToEdit] = useState(null);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');


    useEffect(() => {
        // Función para obtener datos de la API
        const fetchLoadType = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8115/loadType/listAll",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                setLoadTypes(response.data.value); // Suponiendo que el backend devuelve un array de barcos
            } catch (error) {
                console.error('Error al obtener los barcos:', error);
            }
        };

        fetchLoadType();
        console.log("Cargas: " + loadTypes);
    }, []);

    useEffect(() => {
        fetchShips();
      }, []);


    
      useEffect(() => {
        if (message) {
          const timeout = setTimeout(() => setMessage(''), 5000); // Ocultar después de 5 segundos
          return () => clearTimeout(timeout);
        }
      }, [message]);
      

      const fetchShips = async () => {
          
        if (!token) {
          console.error("JWT no encontrado");
          return;
        }
  
        try {
          const response = await axios.get(
            "http://localhost:8115/ship/list",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const formattedShips = response.data.value.map((ship) => ({
            id: ship.id,
            name: ship.name,
            amountEmployee: ship.amountEmployee,
            typeShip: ship.typeShip
          }));
  
          setShips(formattedShips);
        } catch (error) {
          console.error("Error al obtener los barcos:", error);
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
            name: "Tipo",
            selector: (row) => row.typeShip,
            sortable: true,
            wrap: true,
        },
        {
            name: "Empleados",
            selector: (row) => row.amountEmployee,
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
                    openModal(row);
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

    const handleEdit = () => {
        console.log("Editado!");
    }

    const handleDelete = () => {
        console.log("Eliminado!");

    }

    const editShip = () => {
        console.log("Editado!");
    }

    const confirmDelete = async () => {
        if (!shipToDelete) return;

        const type = shipToDelete.typeShip === 'Pasajeros' ? "0" : "1";
        
        try {
            const response = await axios.post(
                'http://localhost:8115/ship/delete',
                { id: shipToDelete.id, type},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setMessage(response.data.value);
              fetchShips();
        }
        catch (e) {
            console.log("error: " + e.message);
            setMessage("Error al intentar eliminar el barco!");
        }
        

        console.log("Eliminado el barco!");
        console.log(shipToDelete);
        console.log("tipos: " + type);
        closeModal();
    };

    const openModal = (ship) => {
        setShipToDelete(ship);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setShipToDelete(null);
    };

    const openModalEdit = (ship) => {
        setShipToEdit(ship);
        setModalIsOpenEdit(true);
    };

    const closeModalEdit = () => {
        setModalIsOpenEdit(false);
        setShipToEdit(null);
        fetchShips();
    };

    const createPassengerShip = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8115/Passenger_ship/create',
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setMessage("¡Barco de pasajeros creado exitosamente!");
              fetchShips();
        }
        catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                setMessage("Error: " + e.response.data.message);
              } else {
                setMessage("Error desconocido al crear el barco de pasajeros.");
              }
              console.error("Error al crear el barco de pasajeros:", e);
        }
    }

    const createCargoShip = async () => {
        
        console.log("Nombre barco de carga: " + name);
        console.log("idCargo: " + selectedLoadType);
        try {
            const response = await axios.post(
                'http://localhost:8115/cargoShip/create',
                { name, idCargo: selectedLoadType },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setMessage("¡Barco de carga creado exitosamente!");
              fetchShips();
        }
        catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                // Si el backend envía un mensaje de error, lo capturamos
                setMessage("Error: " + e.response.data.message);
            } else {
                // Si no hay mensaje del backend, mostramos un error genérico
                setMessage("Error desconocido al crear el barco de carga.");
            }
            console.error("Error al crear el barco de carga:", e);
        }
    }

    const handleLoadTypeChange = (e) => {
        setSelectedLoadType(e.target.value);
    };

    const verValor = (e) => {
        e.preventDefault();

        switch(type) {

            case 'Passenger':
                createPassengerShip();
                break;
            case 'Cargo':
                createCargoShip();
                console.log("Es un barco de carga!");
                break;
            default:
                setMessage("Tipo no reconocido, error!");

        }

        console.log(name);
        console.log(type);
    }

    return (
        <>
        <NavBar myUser={username} ></NavBar>
        <div className='navegation-container'>
            <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="active" to="#">Gestión Embarcaciones</NavLink>
            <p className="hidden-separator">&gt;</p>
        </div>
        <div className="alert-container">
            {message && (
                <div className={`alert alert-${message.startsWith("Error") ? "danger" : "success"}`} role="alert">
                    {message}
                </div>
            )}
        </div>
        <div className="form-container">
            <form >
                <div className="name-container">
                    <label>Nombre</label>
                    <input 
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        >
                    </input>
                </div>
                <div className="type-container">
    <label>Tipo</label>
    <select 
        value={type} // Vincula el valor seleccionado al estado
        onChange={(e) => setType(e.target.value)} // Actualiza el estado cuando cambia la selección
    >
        <option value="" disabled>
            Seleccione una opción
        </option>
        <option value="Cargo">Carga</option>
        <option value="Passenger">Pasajeros</option>
    </select>
</div>
                {type === "Cargo" && (
                    <div className="load-container">
                        <label>Carga</label>
                        <select onChange={handleLoadTypeChange} value={selectedLoadType}>
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                            {loadTypes.map((load) => (
                                <option key={load.id} value={load.id}>
                                    {load.name}
                                </option>
                            ))}
                            </select>
                    </div>
                )}
                <div className="buttons-container">
                    <button type="submit" className="btn btn-primary" onClick={(e) => verValor(e)}>Ingresar</button>
                    <p>{message}</p>
                </div>
            </form>
        </div>
        {modalIsOpen && <ModalDeleteShip
                closeModal={closeModal}
                shipToDelete={shipToDelete}
                deleteShip={confirmDelete}
            />}

        {modalIsOpenEdit && <ModalEditShip
                        closeModal={closeModalEdit}
                        shipToEdit={shipToEdit}
                        editShip={editShip}
                        setFormMessage={setMessage}
                    />}
        <div className="table-container">
            <DataTable
            title="Barcos"
            columns={columns}
            data={ships}
            pagination
            responsive
            striped
            highlightOnHover
        />
        </div>
        </>
    )
}

export default ShipManagement;