import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
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
    </div>
  );
};

export default AdminDashboard;
