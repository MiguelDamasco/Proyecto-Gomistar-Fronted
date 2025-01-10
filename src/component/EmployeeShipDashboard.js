import React from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import "../css/NavBar.css";
import "../css/ShipDashboard.css";

const EmployeeShipDashboard = () => {

    const username = localStorage.getItem('username');


    return (
        <>
    <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">Panel tripulantes</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div className="ship-container">
      <div class="card">
        <Link to="/barco_pasajeros_tripulantes">
        <div className="image-container">
          <img className="image-ship" src="https://cdn5.dibujos.net/dibujos/pintar/una-lancha_2.png"></img>
        </div>
        <div className="text-container">
          <span className="text-ship">Lanchas de transporte</span>
        </div>
        </Link>
      </div>
      <div class="card">
        <Link to="/barco_carga_tripulantes">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Barcos de carga</span>
            </div>
          </Link>
        </div>
        
    </div>
    </>
    )
}

export default EmployeeShipDashboard;