import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from 'react-router-dom';
import NavBar from "./NavBarComponent";
import AlertMessage from "./alert/AlertMessage";
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
    </>
  );
};

export default ConfirmEmail;

