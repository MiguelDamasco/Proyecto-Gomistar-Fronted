import React, { useEffect, useState } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import "../css/NavBar.css";
import "../css/ShipDashboard.css";


const ShipDashboard = () => {
  
  //const navigate = useNavigate();
  const username = localStorage.getItem('username');

  return (
    <>
    <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">Embarcaciones</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div className="ship-container">
      <div class="card">
        <Link to="/gestion_barcos">
        <div className="image-container">
          <img className="image-ship" src="https://www.pikpng.com/pngl/b/57-575354_png-file-svg-ancla-de-barco-png-clipart.png"></img>
        </div>
        <div className="text-container">
          <span className="text-ship">Gestión de embarcación</span>
        </div>
        </Link>
      </div>
      <div class="card">
        <Link to="/gestion_tripulantes">
        <div className="image-container">
            <img className="image-ship" src="https://cdn-icons-png.flaticon.com/512/1470/1470561.png"></img>
          </div>
          <div className="text-container">
            <span className="text-ship">Gestión de tripulantes</span>
          </div>
        </Link> 
        </div>
        <div class="card">
          <Link to="/documentos_embarcación">
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

export default ShipDashboard;

