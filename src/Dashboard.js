import React, { useContext, useState } from 'react';
import { useNavigate, Link, NavLink, Outlet } from 'react-router-dom';
import UserTest from './component/UserTest';
import NavBar from './component/NavBarComponent';
import { userContext } from './App';
import './css/NavegationDir.css'



const Dashboard = () => {

  const { user, setUser } = useContext(userContext);

  const username = localStorage.getItem('username'); // Obtener el nombre del usuario del localStorage

  //const username = user.username;

  //console.log("mirando el usuario logeado: " + user.username);


  return (
   <>
   <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="active" to="/">Inicio</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div>
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <p>Este es el contenido del Dashboard.</p>
        <div class="container">
    <div class="card">
    <Link to="/configuration">
        <img src="https://img.freepik.com/vector-premium/perfil-avatar-hombre-icono-redondo_24640-14044.jpg"
        style={{ height: "300px", width: "300px" }} 
        alt="Imagen 1"/>
        <div class="title">Mis datos</div>
      </Link>
    </div>
    <div class="card">
      <a href="https://example.com/2">
        <img src="https://png.pngtree.com/png-clipart/20190922/original/pngtree-documentation-icon-in-trendy-style-isolated-background-png-image_4779691.jpg" 
        style={{ height: "300px", width: "300px" }} 
        alt="Imagen 2"/>
        <div class="title">Documentos</div>
      </a>
    </div>
    <div class="card">
      <a href="/dashboard/userTest">
        <img src="https://w7.pngwing.com/pngs/350/89/png-transparent-computer-icons-google-alerts-others-orange-silhouette-red-alert.png" 
        style={{ height: "300px", width: "300px" }} 
        alt="Imagen 3"/>
        <div class="title">Alertas</div>
      </a>
    </div>
  </div>
      </div>
    </div>
    </> 
  );
};

export default Dashboard;

