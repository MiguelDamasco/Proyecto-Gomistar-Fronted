import React, { useEffect, useState } from "react";
import NavBar from "../NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from "react-data-table-component";
import "../../css/NavBar.css";
import "../../css/ShipDashboard.css";



const UserDocument = () => {
  const [ships, setShips] = useState([]); // Estado para almacenar la lista de barcos
  const [selectedShip, setSelectedShip] = useState(""); // Estado para el barco seleccionado
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios obtenidos
  const [loading, setLoading] = useState(false); // Estado de carga
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Obtener la lista de barcos
  useEffect(() => {
    const fetchShips = async () => {
      try {
        if (!token) {
          console.error("No se encontró el token JWT.");
          return;
        }

        // Llama al endpoint GET /ship/list
        const response = await axios.get("http://localhost:8115/ship/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShips(response.data.value); // Suponiendo que el backend devuelve un array en `value`
        console.log("Barcos obtenidos:", response.data.value);
      } catch (error) {
        console.error("Error al obtener los barcos:", error);
      }
    };

    fetchShips();
  }, [token]);

  // Manejo del cambio en el select
  const handleShipChange = async (event) => {
    const shipId = event.target.value; // ID del barco seleccionado
    setSelectedShip(shipId);
    setLoading(true);

    try {
      if (!token) {
        console.error("No se encontró el token JWT.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;

      if (shipId === "no-ship") {
        // Llama al endpoint para obtener usuarios sin barco asignado
        response = await axios.get(
          "http://localhost:8115/user/find_All_Without_Ship",
          config
        );
      } else {
        // Llama al endpoint con el ID del barco como parámetro
        response = await axios.get(
          "http://localhost:8115/user/find_by_ship",
          {
            ...config,
            params: { pId: shipId }, // Incluye el ID del barco en los parámetros
          }
        );
      }

      setUsers(response.data.value); // Ajusta según la estructura de la respuesta
      console.log("Usuarios obtenidos:", response.data.value);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDocument = (user) => {
    localStorage.setItem('idUser', user.id);
    localStorage.setItem('identity_card', '');
    navigate("/documentos_por_usuario");
}

  const columns = [
    {
        name: "ID",
        selector: (row) => row.id,
        sortable: true,
    },
    {
        name: "Username",
        selector: (row) => row.username,
        sortable: true,
    },
    {
        name: "Actions",
        cell: (row) => (
          <>

        <button class="Documents-btn" 
        onClick={(e) => {
        e.stopPropagation();
        handleUserDocument(row);
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

  return (
    <>
      <NavBar myUser={username}></NavBar>
      <div className="navegation-container">
        <NavLink className="no-active" to="/admin_panel">
          Inicio
        </NavLink>
        <p className="separator">&gt;</p>
        <NavLink className="active" to="#">
          Documentos Usuario
        </NavLink>
        <p className="hidden-separator">&gt;</p>
      </div>
      <div className="main-container">
        <select 
          value={selectedShip} // Vincula el valor seleccionado al estado
          onChange={handleShipChange} // Maneja el cambio de selección
        >
          <option value="" disabled>
            Seleccione una embarcación
          </option>
          <option value="no-ship">Sin Asignar</option> {/* Opción fija */}
          {ships.map((ship) => (
            <option key={ship.id} value={ship.id}>
              {ship.name} {/* Asume que el backend devuelve 'id' y 'name' */}
            </option>
          ))}
        </select>
      </div>
            <DataTable
        title=""
        columns={columns}
        data={users}
        pagination
        responsive
        striped
        highlightOnHover
        noDataComponent={<div style={{ textAlign: 'center', padding: '10px' }}>No hay información que mostrar</div>}
      />
    </>
  );
};

export default UserDocument;
