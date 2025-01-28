import React, { useState, useEffect } from "react";
import NavBar from "./../NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from 'axios';
import ModalRemoveAlert from "./modal/ModalRemoveAlert";
import ModalEditAlert from "./modal/ModalEditAlert";
import "../../css/NavBar.css";


const AlertAdmin = () => {

    const [alerts, setAlerts] = new useState([]);
    const [isModalModifyOpen, setIsModalModifyOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [alertToDelete, setAlertToDelete] = useState(null);
    const [alertToModify, setAlertToModify] = useState(null);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('id');


    useEffect(() => {
        // Obtener tipos de carga desde la API

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
        <div className='navegation-container'>
            <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="active" to="#">Alertas</NavLink>
            <p className="hidden-separator">&gt;</p>
        </div>
        <div className="title-container">
            <h1>Mis Alertas</h1>
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
        />
        </div>

        {isModalDeleteOpen && <ModalRemoveAlert
            closeModal={closeModalRemove}
            alertToDelete={alertToDelete}
            token={token}
    />}

        {isModalModifyOpen && <ModalEditAlert
            closeModal={closeModalEdit}
            alertToEdit={alertToModify}
            token={token}
    />}
        </>
      )
}

export default AlertAdmin;