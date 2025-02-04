import React, { useEffect, useState } from "react";
import NavBar from "../NavBarComponent";
import axios from 'axios';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import "../../css/NavBar.css";
import "../../css/ShipDashboard.css";
import "./../../css/General.css";
import "./../../css/Card.css";


const UserDashboard = () => {
  const username = localStorage.getItem("username");
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const isConfirmed = localStorage.getItem('email_confirm');
  const [emailRoute, setEmailRoute] = useState('/confirmar_email');
  const amountAlerts = localStorage.getItem('amount_alerts');
  const isAlertClose = localStorage.getItem('isAlertClose');
  const [alertText, setAlertText] = useState('alerta pendiente');
  const navigate = useNavigate();
  
  const myAPI = "http://localhost:8115";

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


  return (
    <>
      <NavBar myUser={username} />
      <div className="navegation-container">
        <div className="navegation-main-container">
          <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
          <p className="separator">&gt;</p>
          <NavLink className="active" to="#">Usuarios</NavLink>
          <p className="hidden-separator">&gt;</p>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="card">
          <Link to="/usuarios">
            <div className="image-container">
              <img className="image-ship" src="https://www.pikpng.com/pngl/b/57-575354_png-file-svg-ancla-de-barco-png-clipart.png" alt="Gestión de usuarios" />
            </div>
            <div className="text-container">
              <span className="text-ship">Gestión de usuarios</span>
            </div>
          </Link>
        </div>

        <div className="card">
          <Link to="/documentos_usuario_admin">
            <div className="image-container">
              <img className="image-ship" src="https://cdn5.dibujos.net/dibujos/pintar/carpeta-portanotas.png" alt="Gestión de documentos" />
            </div>
            <div className="text-container">
              <span className="text-ship">Gestión de documentos</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;