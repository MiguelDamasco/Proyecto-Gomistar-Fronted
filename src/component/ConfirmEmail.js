import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from 'react-router-dom';
import NavBar from "./NavBarComponent";
import AlertMessage from "./alert/AlertMessage";
import Footer from "./Footer";
import "../css/NavBar.css";
import "../css/CargoShipEmployee.css";
import "../css/ConfirmEmail.css";

const ConfirmEmail = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const hasRequestedToken = localStorage.getItem('request');
  const isConfirmed = localStorage.getItem('email_confirm');
  const amountAlerts = localStorage.getItem('amount_alerts');
  const isAlertClose = localStorage.getItem('isAlertClose');
  const [alertText, setAlertText] = useState('alerta pendiente');
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  
  const myAPI = "http://localhost:8115";

  useEffect(() => {

    if(isConfirmed === "1") {
        navigate("/confirmado");
    }
    
    if (hasRequestedToken === "0" && id && token) {
    
      if (localStorage.getItem('request') !== "1") {
        createToken();
        console.log("enviado!");    
        localStorage.setItem('request', "1");
      }
    }
  }, [id, token, hasRequestedToken]);

  useEffect(() => {
    let countdown;

    if (isResendDisabled) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setIsResendDisabled(false);
            clearInterval(countdown);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer, isResendDisabled]);


  useEffect(() => {
              
            fetchAmountAlerts();
            checkText();
    
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
  navigate("/confirmar_email");
  }

  const createToken = async () => {
    try {
        await axios.post(`${myAPI}/user/add_token`, null, {
          params: { pIdUser: id },
          headers: { Authorization: `Bearer ${token}` },
        });

        showSuccessMessage("¡Código enviado!");

      } catch (error) {
        setErrorMessage("Error al crear token");
      }
    }

    const handleVerify = async () => {
        try {
          
          const requestData = {
            idUser: id,
            token: code,
          };
      
          const response = await axios.post(`${myAPI}/user/confirm_email`, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          localStorage.setItem('email_confirm', "1");
          navigate("/confirmado")
        } catch (error) {
          setErrorMessage("Código incorrecto o expirado.");
        }
      };


      const showSuccessMessage = (myMessage) => {
        setAlert({ message: myMessage, type: "success" });
        setTimeout(() => setAlert(null), 3000); 
    
      };
      
      
  const handleResendCode = async () => {

    if (isRequesting) return;

    setIsRequesting(true);
    setErrorMessage("");

    try {
      await axios.post(`${myAPI}/user/add_token`, null, {
        params: { pIdUser: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccessMessage("¡Código reenviado!");
      setTimer(30);
      setIsResendDisabled(true);
    } catch (error) {
      setErrorMessage("Error al reenviar el código.");
    } finally {
      setIsRequesting(false);
      }
  };

  return (
    <>
      <NavBar myUser={username} />
      <div className='navegation-container'>
        <div className="navegation-main-container">
        <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
        <p className="separator">&gt;</p>
        <NavLink className="active" to="#">Confirmar Correo</NavLink>
        <p className="hidden-separator">&gt;</p>
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
            <li><a class="dropdown-item" href="#">Confirmar email</a></li>
            <li><a class="dropdown-item" href="/cambiar_contraseña">Cambiar contraseña</a></li>
            <li><a class="dropdown-item" href="/cambiar_email">Cambiar email</a></li>
        </ul>
      </div>
      </div>
      {Number(amountAlerts) > 0 && isAlertClose === "0" && <div className="alert-background-container">
    <div className="alert-container">
        <p>Tienes {amountAlerts} {alertText}, revise su correro electrónico</p>
        <button type="button" onClick={closeAlert}>X</button>
    </div>
   </div>}
      <div className="email-main-container">
        <h1>Verifique su dirección de correo electrónico</h1>
        <p>Ingrese el código de 6 dígitos enviado a su correo.</p>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
          className="input"
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button id="send-info-button" onClick={handleVerify}>Verificar</button>

        <p>
          ¿No lo ha recibido?{" "}
          <button onClick={handleResendCode} disabled={isResendDisabled || isRequesting}>
            {isResendDisabled ? `Reenviar en 0:${timer}` : "Reenviar código"}
          </button>
        </p>
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

export default ConfirmEmail;

