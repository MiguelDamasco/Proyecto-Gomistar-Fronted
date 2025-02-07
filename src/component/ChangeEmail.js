import React, { useState, useEffect } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink } from 'react-router-dom';
import axios from "axios";
import AlertMessage from "./alert/AlertMessage";
import Footer from "./Footer";
import "../css/NavBar.css";
import "../css/General.css";
import "../css/Form.css";

const ChangeEmail = () => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const username = localStorage.getItem('username');
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const isConfirmed = localStorage.getItem('email_confirm');
  const [emailRoute, setEmailRoute] = useState('/confirmar_email');
  const amountAlerts = localStorage.getItem('amount_alerts');
  const isAlertClose = localStorage.getItem('isAlertClose');
  const [alertText, setAlertText] = useState('alerta pendiente');
  const navigate = useNavigate();

  const myAPI = "http://localhost:8115";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


   useEffect(() => {
            
          fetchAmountAlerts();
          checkText();

          if(isConfirmed === "1") {
              setEmailRoute("/confirmado");
          }
  
        }, [token]);


        const fetchAmountAlerts = async () => {
          if (!id || !token) {
              console.error('Faltan valores requeridos (id o token)');
              return;
          }
      
          try {
              const response = await axios.get(
                  `${myAPI}/user/amount_alerts`,
                  {
                      headers: { Authorization: `Bearer ${token}` },
                      params: { pId: id },
                  }
              );
      
              localStorage.setItem('amount_alerts', response.data.value);
          } catch (error) {
              console.error('Error al obtener la cantidad de alertas:', error);
              localStorage.clear();
              navigate("/login");
          }
      };


  const checkText = () => {

    if(Number(amountAlerts) > 1) {
        setAlertText('alertas pendientes');
      }
    }

    const closeAlert = () => {
      localStorage.setItem('isAlertClose', '1');
      navigate("/cambiar_email");
  }

  const showSuccessMessage = (myMessage) => {
    setAlert({ message: myMessage, type: "success" });
    setTimeout(() => setAlert(null), 3000); 

  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if(!emailRegex.test(newEmail)) {
        setError("El correo electrónico no es válido.");
        return;
    }

    try {

        const checkPasswordResponse = await axios.post(
            `${myAPI}/user/checkPassword`,
            {
              idUser: id,
              password: currentPassword,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          if (checkPasswordResponse.status !== 200) {
            setError("La contraseña ingresada es incorrecta.");
            return;
          }

          try {
            const checkResponse = await axios.get(`${myAPI}/user/check_email`, {
              params: { pEmail: newEmail },
              headers: { Authorization: `Bearer ${token}` },
            });
      
          } catch (error) {
            if (error.response && error.response.status === 400) {
              setError("El email ingresado ya está en uso.");
              return;
            }
            console.error(error);
            setError("Error al verificar el email.");
            return;
          }

      const checkChange = await axios.patch(
        `${myAPI}/user/change_email`,
        {
          idUser: id,
          email: newEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (checkChange.status !== 200) {
        setError("Error al intentar cambiar el email.");
        return;
      }

      showSuccessMessage(checkChange.data.message);

      setCurrentPassword("");
      setNewEmail("");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al intentar cambiar la contraseña.");
    }
  };

  return (
    <>
      <NavBar myUser={username} />
      <div className='navegation-container'>
        <div className="navegation-main-container">
          <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
          <p className="separator">&gt;</p>
          <NavLink className="active" to="#">Cambiar Email</NavLink>
        </div>
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <svg id="gear-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
        </svg>
        </button>

        <ul class="dropdown-menu">
            <li><span class="dropdown-header">Configuración</span></li>
            <li><hr class="dropdown-divider"/></li>
            <li><a class="dropdown-item" href={emailRoute}>Confirmar email</a></li>
            <li><a class="dropdown-item" href="/cambiar_contraseña">Cambiar contraseña</a></li>
            <li><a class="dropdown-item" href="#">Cambiar email</a></li>
        </ul>
      </div>
      </div>

      {Number(amountAlerts) > 0 && isAlertClose === "0" && <div className="alert-background-container">
    <div className="alert-container">
        <p>Tienes {amountAlerts} {alertText}, revise su correro electrónico</p>
        <button type="button" onClick={closeAlert}>X</button>
    </div>
   </div>}

      <div className="form-main-container">
        <form className="form-content">
        <div className="form-title-container">
          <h1>Cambiar Email</h1>
        </div>
        <div className="form-body-container">
          <div className="input-container">
            <input
              type="password"
              placeholder="Ingrese contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              maxLength={64}
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Ingrese nuevo email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              maxLength={50}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-buttons-container">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Enviar
            </button>
          </div>
          
        </div>
        </form>
      </div>

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}


    <Footer></Footer>
    </>
  );
};

export default ChangeEmail;