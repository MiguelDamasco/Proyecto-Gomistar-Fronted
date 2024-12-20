import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './btnLogout.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Obtener el nombre del usuario del localStorage

  const handleLogout = () => {
    localStorage.clear(); // Limpiar localStorage al cerrar sesión
    navigate('/login'); // Redirigir al login
  };

  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ marginRight: '10px' }}>Bienvenido, {username}!</span>
    <div className="logout-container" style={{ display: 'flex', alignItems: 'center' }}>
        <button className="Btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="sign" style={{ marginRight: '5px' }}>
                <svg viewBox="0 0 512 512" style={{ width: '16px', height: '16px' }}>
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
            </div>
            <div className="text">Salir</div>
        </button>
    </div>
</nav>

      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        <p>Este es el contenido del Dashboard.</p>
        <div class="container">
    <div class="card">
    <Link to="/userDashboard">
        <img src="https://5621658.fs1.hubspotusercontent-na1.net/hub/5621658/hubfs/tipos-clasificadores-documentos.jpg?width=800&name=tipos-clasificadores-documentos.jpg" alt="Imagen 1"/>
        <div class="title">Enlace 1</div>
      </Link>
    </div>
    <div class="card">
      <a href="https://example.com/2">
        <img src="https://st.depositphotos.com/34078792/54886/v/1600/depositphotos_548867998-stock-illustration-user-avatar-character-cartoon-avatar.jpg" alt="Imagen 2"/>
        <div class="title">Enlace 2</div>
      </a>
    </div>
    <div class="card">
      <a href="https://example.com/3">
        <img src="https://via.placeholder.com/300" alt="Imagen 3"/>
        <div class="title">Enlace 3</div>
      </a>
    </div>
    <div class="card">
      <a href="https://example.com/4">
        <img src="https://via.placeholder.com/300" alt="Imagen 4"/>
        <div class="title">Enlace 4</div>
      </a>
    </div>
  </div>
      </div>
    </div>
  );
};

export default Dashboard;

