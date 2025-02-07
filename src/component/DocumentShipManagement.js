import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import Footer from "./Footer";
import axios from "axios";
import "../css/NavBar.css";
import "../css/shipDocuments.css";

const DocumentShipManagement = () => {

    const [ships, setShips] = useState([]);
    const [shipType, setShipType] = useState("");
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const isConfirmed = localStorage.getItem('email_confirm');
    const [emailRoute, setEmailRoute] = useState('/confirmar_email');
    const amountAlerts = localStorage.getItem('amount_alerts');
    const isAlertClose = localStorage.getItem('isAlertClose');
    const [alertText, setAlertText] = useState('alerta pendiente');
    const id = localStorage.getItem('id');
    const navigate = useNavigate();

    const tableRef = useRef(null);
    
    const myAPI = "http://localhost:8115";


    useEffect(() => {
      const fetchShips = async () => {
        try {
          if (!token) {
            console.error("No se encontró el token JWT.");
            return;
          }
          
          const response = await axios.get(`${myAPI}/ship/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setShips(response.data.value); 
        } catch (error) {
          console.error("Error al obtener los barcos:", error);
        }
      };
  
      fetchShips();
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
      navigate("/documentos_usuario_admin");
      }

    const fetchCargoShips = async () => {

        if (!token) {
            console.error("JWT no encontrado");
            return;
          }

          try {
            const response = await axios.get(
              `http://localhost:8115/cargoShip/listAll`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
        
            const formattedShip = response.data.value.map((ship) => ({
              id: ship.id,
              name: ship.name,
            }));
        
            setShips(formattedShip);
          } catch (error) {
            console.error("Error al obtener los barcos de carga:", error);
          }
        };


        const fetchPassengerShips = async () => {

            if (!token) {
                console.error("JWT no encontrado");
                return;
              }
    
              try {
                const response = await axios.get(
                  `http://localhost:8115/Passenger_ship/list`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
            
                const formattedShip = response.data.value.map((ship) => ({
                  id: ship.id,
                  name: ship.name,
                }));
            
                setShips(formattedShip);
              } catch (error) {
                console.error("Error al obtener los barcos de carga:", error);
              }
            };


            const handleShipTypeChange = (event) => {
                const selectedType = event.target.value;
                setShipType(selectedType);
        
                if (selectedType === "Carga") {
                    fetchCargoShips();
                } else if (selectedType === "Pasajeros") {
                    fetchPassengerShips();
                }
                setTimeout(() => {
                  if (tableRef.current) {
                    tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 200);
            };

            const handleShipDocument = (ship) => {
                localStorage.setItem('idShip', ship.id);
                navigate("/documentos_barco");
            }
        
            const columns = [
                {
                    name: "ID",
                    selector: (row) => row.id,
                    sortable: true,
                },
                {
                    name: "Nombre",
                    selector: (row) => row.name,
                    sortable: true,
                },
                {
                    name: "Actions",
                    cell: (row) => (
                      <>
            
<button class="Documents-btn" 
    onClick={(e) => {
        e.stopPropagation();
        handleShipDocument(row);
      }}>
  <span class="folderContainer">
    <svg
      class="fileBack"
      width="146"
      height="113"
      viewBox="0 0 146 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
        fill="url(#paint0_linear_117_4)"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_117_4"
          x1="0"
          y1="0"
          x2="72.93"
          y2="95.4804"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8F88C2"></stop>
          <stop offset="1" stop-color="#5C52A2"></stop>
        </linearGradient>
      </defs>
    </svg>
    <svg
      class="filePage"
      width="88"
      height="99"
      viewBox="0 0 88 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="88" height="99" fill="url(#paint0_linear_117_6)"></rect>
      <defs>
        <linearGradient
          id="paint0_linear_117_6"
          x1="0"
          y1="0"
          x2="81"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white"></stop>
          <stop offset="1" stop-color="#686868"></stop>
        </linearGradient>
      </defs>
    </svg>

    <svg
      class="fileFront"
      width="160"
      height="79"
      viewBox="0 0 160 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
        fill="url(#paint0_linear_117_5)"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_117_5"
          x1="38.7619"
          y1="8.71323"
          x2="66.9106"
          y2="82.8317"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C3BBFF"></stop>
          <stop offset="1" stop-color="#51469A"></stop>
        </linearGradient>
      </defs>
    </svg>
  </span>
  <p class="text">Documents</p>
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
            <div className='navegation-container'>
              <div className="navegation-main-container">
                  <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
                  <p className="separator">&gt;</p>
                  <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
                  <p className="separator">&gt;</p>
                  <NavLink className="active" to="#">Documentos embarcación</NavLink>
                  <p className="hidden-separator">&gt;</p>
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
            <div className="main-container">
              <div className="title-container">
                <h1>Embarcaciones</h1>
              </div>
                <div className="selector-container">
                <label htmlFor="shipType">Tipo de Barco:</label>
                    <select id="shipType" value={shipType} onChange={handleShipTypeChange}>
                        <option value="" disabled>Seleccione tipo de embarcación</option>
                        <option value="Carga">Carga</option>
                        <option value="Pasajeros">Pasajeros</option>
                    </select>
                </div>
            </div>
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
    );
}

export default DocumentShipManagement;