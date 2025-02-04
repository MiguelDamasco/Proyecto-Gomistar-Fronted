import React from 'react';
import NavBar from './NavBarComponent';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import '../css/NavBar.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');



  return (
    <>
   <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
    <div className="navegation-main-container">
        <NavLink className="active" to="#">Inicio</NavLink>
        <p className="hidden-separator">&gt;</p>
      </div>
   </div>
        <div className="ship-container">
          <div class="card">
            <Link to="/barcos">
            <div className="image-container">
              <img className="image-ship" src="https://cdn-icons-png.freepik.com/512/90/90570.png"></img>
            </div>
            <div className="text-container">
              <span className="text-ship">Embarcaciones</span>
            </div>
            </Link>
          </div>
          <div class="card">
            <Link to="/gestion_usuarios">
            <div className="image-container">
                <img className="image-ship" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8gXGxAPC35Ha1Qw2yryImpvyoMkMgV0gRZA&s"></img>
              </div>
              <div className="text-container">
                <span className="text-ship">Usuarios</span>
              </div>
            </Link> 
            </div>
            <div class="card">
              <Link to="/alerta_admin">
            <div className="image-container">
                <img className="image-ship" src="https://cdn5.dibujos.net/dibujos/pintar/carpeta-portanotas.png"></img>
              </div>
              <div className="text-container">
                <span className="text-ship">Alertas</span>
              </div>
              </Link>
            </div>
          </div>
    </>
  );
};

export default AdminDashboard;
