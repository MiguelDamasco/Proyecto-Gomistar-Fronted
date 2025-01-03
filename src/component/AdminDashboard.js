import React from 'react';
import NavBar from './NavBarComponent';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import '../css/NavBar.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Obtener el nombre del usuario del localStorage

  const handleLogout = () => {
    localStorage.clear(); // Limpiar localStorage al cerrar sesión
    navigate('/login'); // Redirigir al login
  };

  return (
    <>
   <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="active" to="#">Inicio</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
      <div style={{ padding: '20px' }}>
        <h1>Dashboard Admin</h1>
        <div class="container">
    <div class="card">
    <Link to="/barcos">
        <img src="https://cdn-icons-png.freepik.com/512/90/90570.png"
        style={{ height: "300px", width: "300px" }} 
        alt="Imagen de embarcaciones"/>
        <div class="title">Embarcaciones</div>
      </Link>
    </div>
    <div class="card">
      <Link to="/gestion_usuario">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8gXGxAPC35Ha1Qw2yryImpvyoMkMgV0gRZA&s" 
        style={{ height: "300px", width: "300px" }}
        alt="Imagen de empleados"/>
        <div class="title">Empleados</div>
      </Link>
    </div>
    <div class="card">
      <a href="#">
        <img src="https://img.freepik.com/vector-premium/perfil-avatar-hombre-icono-redondo_24640-14044.jpg"
        style={{ height: "300px", width: "300px" }}
        alt="Imagen de mis datos"/>
        <div class="title">Mis datos</div>
      </a>
    </div>
    <div class="card">
      <a href="#">
        <img src="https://w7.pngwing.com/pngs/350/89/png-transparent-computer-icons-google-alerts-others-orange-silhouette-red-alert.png" 
        style={{ height: "300px", width: "300px" }}
        alt="Imagen 4"/>
        <div class="title">Alertas</div>
      </a>
    </div>
  </div>
      </div>
    </>
  );
};

export default AdminDashboard;
