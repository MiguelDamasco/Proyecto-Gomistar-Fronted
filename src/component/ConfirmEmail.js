import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from 'react-router-dom';
import NavBar from "./NavBarComponent";
import "../css/NavBar.css";
import "../css/CargoShipEmployee.css";
import "../css/ConfirmEmail.css";

const ConfirmEmail = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const idUser = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const hasRequestedToken = localStorage.getItem('request');
  const isConfirmed = localStorage.getItem('email_confirm');
  const navigate = useNavigate();
  

  useEffect(() => {

    if(isConfirmed === "1") {
        navigate("/confirmado");
    }
    
    if (hasRequestedToken === "0" && idUser && token) {
    
      if (localStorage.getItem('request') !== "1") {
        createToken();
        console.log("enviado!");    
        localStorage.setItem('request', "1");
      }
    }
  }, [idUser, token, hasRequestedToken]);

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

    return () => clearInterval(countdown); // Limpiar el temporizador al desmontar
  }, [timer, isResendDisabled]); // Se ejecuta cuando `timer` o `isResendDisabled` cambian

  const createToken = async () => {
    try {
        await axios.post("http://localhost:8115/user/add_token", null, {
          params: { pIdUser: idUser },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Enviado!");
  
      } catch (error) {
        setErrorMessage("Error al crear token");
      }
    }


    const handleVerify = async () => {
        try {
          // Crear el objeto con los datos requeridos
          const requestData = {
            idUser: idUser,
            token: code,
          };
      
          // Enviar el request con el cuerpo del mensaje (RequestBody) y el JWT en los encabezados
          const response = await axios.post("http://localhost:8115/user/confirm_email", requestData, {
            headers: {
              "Content-Type": "application/json", // Enviar los datos como JSON
              Authorization: `Bearer ${token}`, // Agregar el token JWT en los encabezados
            },
          });
      
          localStorage.setItem('email_confirm', "1");
          navigate("/confirmado")
        } catch (error) {
          // Mostrar error en caso de fallo
          setErrorMessage("Código incorrecto o expirado.");
        }
      };
      
      

  const handleResendCode = async () => {

    if (isRequesting) return; // Evita múltiples clics

    setIsRequesting(true); // Bloquea el botón mientras se envía la solicitud
    setErrorMessage(""); // Limpia mensajes de error previos

    try {
      await axios.post("http://localhost:8115/user/add_token", null, {
        params: { pIdUser: idUser },
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Código reenviado!");
      setTimer(30);  // Reinicia el temporizador
      setIsResendDisabled(true);  // Vuelve a deshabilitar el botón
    } catch (error) {
      setErrorMessage("Error al reenviar el código.");
    } finally {
      setIsRequesting(false); // Habilita el botón después de recibir respuesta
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
    </>
  );
};

export default ConfirmEmail;

