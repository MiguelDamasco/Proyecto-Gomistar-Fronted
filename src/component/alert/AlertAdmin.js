import React, { useState, useEffect } from "react";
import NavBar from "./../NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import ModalRemoveAlert from "./modal/ModalRemoveAlert";
import ModalEditAlert from "./modal/ModalEditAlert";
import AlertMessage from "./AlertMessage";
import "../../css/NavBar.css";


const AlertAdmin = () => {

    const [alerts, setAlerts] = new useState([]);
    const [isModalModifyOpen, setIsModalModifyOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [alertToDelete, setAlertToDelete] = useState(null);
    const [alertToModify, setAlertToModify] = useState(null);
    const [emailRoute, setEmailRoute] = useState('/confirmar_email');
    const [alert, setAlert] = useState(false);
    const isConfirmed = localStorage.getItem('email_confirm');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('id');


    useEffect(() => {
        
        if(isConfirmed === "1") {
            setEmailRoute("/confirmado");
        }

        fetchAlerts();
    }, [token, idUser]);


    const fetchAlerts = async () => {
        try {
            const response = await axios.get(
              `http://localhost:8115/user/alerts_admin`,
              {
                params: { pIdUser: idUser },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
        
            const formattedAlerts = response.data.value.map((alert) => ({
              id: alert.id,
              type: alert.type,
              date: alert.date,
              days: alert.days,
            }));

            setAlerts(formattedAlerts);
        } catch (error) {
            console.error('Error al obtener las alertas:', error);
        }
    };

    const showSuccessModify = (myMessage) => {
        setAlert({ message: myMessage, type: "success" });
        setTimeout(() => setAlert(null), 3000); 
        };

    const openModalRemove = (alert) => {
        console.log("Eliminado!");
        setIsModalDeleteOpen(true);
        setAlertToDelete(alert);
    };

    const openModalEdit = (alert) => {
        console.log("Modificado!");
        setIsModalModifyOpen(true);
        setAlertToModify(alert);
    }

    const closeModalRemove = () => {
        fetchAlerts();
        setIsModalDeleteOpen(false);
    }

    const closeModalEdit = () => {
        fetchAlerts();
        setIsModalModifyOpen(false);
    }

    const paginationOptions = {
      rowsPerPageText: "Filas por página",
      rangeSeparatorText: "de",
      noRowsPerPage: false,
      selectAllRowsItem: false,
    };

    const columns = [
        {
          name: "ID",
          selector: (row) => row.id,
          sortable: true,
          width: "70px",
        },
        {
          name: "Tipo",
          selector: (row) => row.type,
          sortable: true,
          wrap: true,
        },
        {
          name: "Fecha",
          selector: (row) => row.date,
          sortable: true,
          wrap: true,
        },
        {
          name: "Tiempo Restante",
          selector: (row) => row.days,
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
        <NavBar myUser={username} ></NavBar>
        <div className="navegation-container">
            <div className="navegation-main-container">
            <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="active" to="#">Alertas</NavLink>
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
                    <li><a class="dropdown-item" href="#" >Something else here</a></li>
                </ul>
          </div>
        </div>
        <div className="main-container">
        <div className="title-container">
            <h1>Mis Alertas</h1>
        </div>
        </div>
        <div className="data-container">
            <DataTable
            title=""
            columns={columns}
            data={alerts}
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

        {isModalDeleteOpen && <ModalRemoveAlert
            closeModal={closeModalRemove}
            alertToDelete={alertToDelete}
            token={token}
            alertMessage={showSuccessModify}
    />}

        {isModalModifyOpen && <ModalEditAlert
            closeModal={closeModalEdit}
            alertToEdit={alertToModify}
            token={token}
            alertMessage={showSuccessModify}
    />}
        </>
      )
}

export default AlertAdmin;