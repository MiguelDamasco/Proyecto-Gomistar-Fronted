import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { userContext } from "../App";
import '../btnLogout.css';
import '../css/NavBar.css';


const NavBar = (props) => {

    const navigate = useNavigate();

    const { user, setUser } = useContext(userContext);

    const handleLogout = () => {
        localStorage.clear(); // Limpiar localStorage al cerrar sesión
        setUser(null);
        navigate('/login'); // Redirigir al login
      };


    return (
        <>
        <nav className="navbar">
            <div className="nav-text">
                <img id="logo" src="https://gomistar.com.uy/wp-content/uploads/2022/08/LogoS-Gomistar.svg"></img>
                <h1 id="text">Hola, {props.myUser}!!!</h1>
            </div> 
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
       </>
    )
}

export default NavBar;