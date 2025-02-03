import React, { useEffect, useState } from "react";
import NavBar from "../NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import "../../css/NavBar.css";
import "../../css/ShipDashboard.css";
import "./../../css/General.css";


const UserDashboard = () => {
  
  const username = localStorage.getItem('username');

  return (
    <>
    <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
    <div className="navegation-main-container">
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">Usuarios</NavLink>
      <p className="hidden-separator">&gt;</p>
      </div>
   </div>
    <div className="ship-container">
      <div class="card">
        <Link to="/usuarios">
        <div className="image-container">
          <img className="image-ship" src="https://www.pikpng.com/pngl/b/57-575354_png-file-svg-ancla-de-barco-png-clipart.png"></img>
        </div>
        <div className="text-container">
          <span className="text-ship">Gestión de usuarios</span>
        </div>
        </Link>
      </div>
      <div class="card">
        <Link to="/documentos_usuario_admin">
        <div className="image-container">
            <img className="image-ship" src="https://cdn5.dibujos.net/dibujos/pintar/carpeta-portanotas.png"></img>
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