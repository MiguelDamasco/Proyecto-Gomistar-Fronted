import React, { useState, useEffect, useRef  } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from "react-data-table-component";
import "../css/NavBar.css";
import ModalDeleteShip from "./modal/ModalDeleteShip";
import ModalEditShip from "./modal/ModalEditShip";
import AlertMessage from "./alert/AlertMessage";
import Footer from "./Footer";
import "../css/ModalDeleteShip.css";
import "../css/Form.css";
import "../css/General.css";


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
    const [emailRoute, setEmailRoute] = useState('/confirmar_email');
    const [alert, setAlert] = useState(false);
    const amountAlerts = localStorage.getItem('amount_alerts');
    const isAlertClose = localStorage.getItem('isAlertClose');
    const [alertText, setAlertText] = useState('alerta pendiente');
    const id = localStorage.getItem('id');
    const isConfirmed = localStorage.getItem('email_confirm');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const tableRef = useRef(null);
    const navigate = useNavigate();

    const myAPI = "http://localhost:8115";

    useEffect(() => {
        const fetchLoadType = async () => {
            try {
                const response = await axios.get(
                    `${myAPI}/loadType/listAll`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                setLoadTypes(response.data.value);
            } catch (error) {
                console.error('Error al obtener los barcos:', error);
            }
        };

        fetchLoadType();
    }, []);

    useEffect(() => {

      if(isConfirmed === "1") {
        setEmailRoute("/confirmado");
      }
        fetchShips();
      }, []);



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
        navigate("/gestion_barcos");
    }

      

      const fetchShips = async () => {
          
        if (!token) {
          console.error("JWT no encontrado");
          return;
        }
  
        try {
          const response = await axios.get(
            `${myAPI}/ship/list`,
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


    const editShip = () => {
        console.log("Editado!");
    }

    const confirmDelete = async () => {
        if (!shipToDelete) return;

        const type = shipToDelete.typeShip === 'Pasajeros' ? "0" : "1";
        
        try {
            const response = await axios.post(
                `${myAPI}/ship/delete`,
                { id: shipToDelete.id, type},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              showSuccessMessage(response.data.message);
              fetchShips();
        }
        catch (e) {
            setMessage("Error al intentar eliminar el barco!");
        }
        
        closeModal();
    };

    const viewTable = () => {
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    }

    const showSuccessMessage = (myMessage) => {
      setAlert({ message: myMessage, type: "success" });
      setTimeout(() => setAlert(null), 3000); 

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

      if(name.length < 4) {
        setMessage("El nombre debe tener más de 3 letras.");
        return;
      }

        try {
            const response = await axios.post(
                'http://localhost:8115/Passenger_ship/create',
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              showSuccessMessage(response.data.message);
              fetchShips();
              viewTable();
              clearInputName();
              setMessage("");
        }
        catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                setMessage("Ingrese un tipo de carga");
              } else {
                setMessage("Error desconocido al crear el barco de pasajeros.");
              }
        }
    }

    const createCargoShip = async () => {

      if(name.length < 4) {
        setMessage("El nombre debe tener más de 3 letras.");
        return;
      }
    
        try {
            const response = await axios.post(
                `${myAPI}/cargoShip/create`,
                { name, idCargo: selectedLoadType },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              showSuccessMessage(response.data.message);
              fetchShips();
              viewTable();
              clearInputName();
              setMessage("");
        }
        catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
               
                setMessage("Ingrese un tipo de carga.");
            } else {
               
                setMessage("Error desconocido al crear el barco de carga.");
            }
            console.error("Error al crear el barco de carga:", e);
        }
    }

    const handleLoadTypeChange = (e) => {
        setSelectedLoadType(e.target.value);
    };


    const handleKeyPress = (e) => {
      const charCode = e.charCode || e.keyCode;
      const char = String.fromCharCode(charCode);
    
      if (!/^[a-zA-Z\s]$/.test(char)) {
        e.preventDefault();
      }
    };
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      setName(value);
    };
    
    const clearInputName = () => {
      setName('');
    };

    const verValor = (e) => {
        e.preventDefault();

        switch(type) {

            case 'Passenger':
                createPassengerShip();
                break;
            case 'Cargo':
                createCargoShip();
                break;
            default:
                setMessage("Tipo no reconocido, error!");
        }
    }

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
            <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="active" to="#">Gestión Embarcaciones</NavLink>
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
            <form className="form-content">
              <div className="form-title-container">
                <h1>Gestión Embarcaciones</h1>
              </div>
                <div className="form-name-container">
                    <label>Nombre</label>
                    <input 
                        type="text"
                        name="name"
                        value={name}
                        minLength={3}
                        maxLength={25}
                        required
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        >
                    </input>
                </div>
                <div className="form-type-container">
                    <label>Tipo</label>
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="" disabled>
                            Seleccione una opción
                        </option>
                        <option value="Cargo">Carga</option>
                        <option value="Passenger">Pasajeros</option>
                    </select>
                </div>
                {type === "Cargo" && (
                    <div className="form-load-container">
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
                <div className="form-buttons-container">
                    <button type="submit" className="btn btn-primary" onClick={(e) => verValor(e)}>Ingresar</button>
                    <p>{message}</p>
                </div>
            </form>
        </div>

        {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

        {modalIsOpen && <ModalDeleteShip
                closeModal={closeModal}
                shipToDelete={shipToDelete}
                deleteShip={confirmDelete}
            />}

        {modalIsOpenEdit && <ModalEditShip
                        closeModal={closeModalEdit}
                        shipToEdit={shipToEdit}
                        editShip={editShip}
                        setFormMessage={showSuccessMessage}
                    />}
        <div ref={tableRef} className="table-container">
            <DataTable
            title=""
            columns={columns}
            data={ships}
            pagination
            responsive
            striped
            highlightOnHover
            noDataComponent={<div style={{ textAlign: 'center', padding: '10px' }}>No hay información que mostrar</div>}
            paginationComponentOptions={paginationOptions}
        />
        </div>
        <Footer></Footer>
        </>
    )
}

export default ShipManagement;