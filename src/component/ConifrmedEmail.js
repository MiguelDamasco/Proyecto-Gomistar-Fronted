import React, { useState, useEffect } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, Link, NavLink } from 'react-router-dom';
import "./../css/NavBar.css";
import "./../css/General.css";
import "./../css/modal/GenericModal.css";

const ConfirmedEmail = () => {

    const username = localStorage.getItem('username');

    return (
        <>
        <NavBar myUser={username}></NavBar>
        <div className='navegation-container'>
            <div className="navegation-main-container">
          <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
          <p className="separator">&gt;</p>
          <NavLink className="active">Correo confirmado</NavLink>
          </div>
       </div>
        
        <div className="main-container">
            <div className="title-container">
                <h1>¡Confirmado!</h1>
            </div>
            <div className="body-container">
                <svg id="confirmed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
        </div>
        
        </>
      );


};


export default ConfirmedEmail;