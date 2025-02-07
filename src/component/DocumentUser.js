import React, { useState, useEffect, useRef  } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import DataTable from "react-data-table-component";
import "../css/NavBar.css";
import ModalDeleteShip from "./modal/ModalDeleteShip";
import ModalEditShip from "./modal/ModalEditShip";
import AlertMessage from "./alert/AlertMessage";
import ModalAddDocument1 from "./users/modal/ModalAddDocument1";
import ModalAddDocument2 from "./users/modal/ModalAddDocument2";
import ModalAddDocument3 from "./users/modal/ModalAddDocument3";
import ModalAddDocument4 from "./users/modal/ModalAddDocument4";
import ModalViewDocument1 from "./users/modal/ModalViewDocument1";
import ModalViewDocument2 from "./users/modal/ModalViewDocument2";
import ModalViewDocument3 from "./users/modal/ModalViewDocument3";
import ModalViewDocument4 from "./users/modal/ModalViewDocument4";
import ModalRemoveDocument1 from "./users/modal/ModalRemoveDocument1";
import ModalRemoveDocument2 from "./users/modal/ModalRemoveDocument2";
import ModalRemoveDocument3 from "./users/modal/ModalRemoveDocument3";
import ModalRemoveDocument4 from "./users/modal/ModalRemoveDocument4";
import Footer from "./Footer";
import "../css/ModalDeleteShip.css";
import "../css/Form.css";
import "../css/General.css";


const DocumentUser = () => {

    const [amountDocuments, setAmounDocuments] = useState([]);
    const [document1Active, setDocument1Active] = useState(false);
    const [document2Active, setDocument2Active] = useState(false);
    const [document3Active, setDocument3Active] = useState(false);
    const [document4Active, setDocument4Active] = useState(false);
    const [modalDocument1Active, setmodalDocument1Active] = useState(false);
    const [modalDocument2Active, setmodalDocument2Active] = useState(false);
    const [modalDocument3Active, setmodalDocument3Active] = useState(false);
    const [modalDocument4Active, setmodalDocument4Active] = useState(false);
    const [modalViewDocument1Active, setmodalViewDocument1Active] = useState(false);
    const [modalViewDocument2Active, setmodalViewDocument2Active] = useState(false);
    const [modalViewDocument3Active, setmodalViewDocument3Active] = useState(false)
    const [modalViewDocument4Active, setmodalViewDocument4Active] = useState(false)
    const [modalRemoveDocument1Active, setmodalRemoveDocument1Active] = useState(false);
    const [modalRemoveDocument2Active, setmodalRemoveDocument2Active] = useState(false);
    const [modalRemoveDocument3Active, setmodalRemoveDocument3Active] = useState(false);
    const [modalRemoveDocument4Active, setmodalRemoveDocument4Active] = useState(false);
    const [emailRoute, setEmailRoute] = useState('/confirmar_email');
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('alerta pendiente');
    const [selectedFile, setSelectedFile] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const username = localStorage.getItem('username');
    const idUser = localStorage.getItem('id');
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const amountAlerts = localStorage.getItem('amount_alerts');
    const isAlertClose = localStorage.getItem('isAlertClose');
    const isConfirmed = localStorage.getItem('email_confirm');
    let imageIdentityCard = localStorage.getItem('identity_card') || '';
    const navigate = useNavigate();

    const myAPI = "http://localhost:8115";


    useEffect(() => {

        if(isConfirmed === "1") {
            setEmailRoute("/confirmado");
        }

        fetchamountDocuments();
    }, [token, idUser]);


    useEffect(() => {

        fetchAmountAlerts();
        fetchImageIdentityCard();
        checkText();
    }, [token, idUser]);

    const fetchAmountAlerts = async () => {
        if (!id || !token) {
            console.error('Faltan valores requeridos (idUser o token)');
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

    const fetchImageIdentityCard = async () => {
        if (!idUser || !token) {
            console.error('Faltan valores requeridos (idUser o token)');
            return;
        }

        try {
            const response = await axios.get(
                `${myAPI}/identity_card/image`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdUser: idUser },
                }
            );

            if (response.data.value != null) {
                localStorage.setItem('identity_card', response.data.value);
            }
        } catch (error) {
            console.error('Error al obtener la imagen:', error);
        }
    };
    


    const fetchamountDocuments = async () => {

        if (!idUser || !token) {
            console.error('Faltan valores requeridos (idUser o token)');
            return;
        }

        try {
            const response = await axios.get(
                `${myAPI}/user/amount_documents`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pId: idUser },
                }
            );
            if (Array.isArray(response.data.value)) {
                setAmounDocuments(response.data.value);
                checkDocuments(response.data.value);
            } else {
                console.error("La respuesta no contiene un array en 'value'");
            };
        } catch (error) {
            console.error('Error al la cantidad de documentos:', error);
        }
    };

    

    const checkDocuments = async (data) => {
        if (data.length > 0) {
            setDocument1Active(data[0] !== null);
            setDocument2Active(data[1] !== null);
            setDocument3Active(data[2] !== null);
            setDocument4Active(data[3] !== null);
        }
    };

    const closeModal = () => {
        setmodalDocument1Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModal = () => {
        setmodalDocument1Active(true);
    };

    const openModal2 = () => {
        setmodalDocument2Active(true);
    };

    const closeModal2 = () => {
        setmodalDocument2Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModal3 = () => {
        setmodalDocument3Active(true);
    };

    const closeModal3 = () => {
        setmodalDocument3Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModal4 = () => {
        setmodalDocument4Active(true);
    };

    const closeModal4 = () => {
        setmodalDocument4Active(false);
        fetchamountDocuments();
        localStorage.setItem('identity_card', '');
        window.location.reload();
        fetchAmountAlerts();
    };



    const closeModalView1 = () => {
        setmodalViewDocument1Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModalView1 = () => {
        setmodalViewDocument1Active(true);
    };

    const closeModalView2 = () => {
        setmodalViewDocument2Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModalView2 = () => {
        setmodalViewDocument2Active(true);
    };

    const closeModalView3 = () => {
        setmodalViewDocument3Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModalView4 = () => {
        setmodalViewDocument4Active(true);
    };

    const closeModalView4 = () => {
        setmodalViewDocument4Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    };

    const openModalView3 = () => {
        setmodalViewDocument3Active(true);
    };

    const openModalRemove1 = () => {
        setmodalRemoveDocument1Active(true);
    }

    const closeModalRemove1 = () => {
        setmodalRemoveDocument1Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    }

    const openModalRemove2 = () => {
        setmodalRemoveDocument2Active(true);
    };
    

    const closeModalRemove2 = () => {
        setmodalRemoveDocument2Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    }

    const openModalRemove3 = () => {
        setmodalRemoveDocument3Active(true);
    };
    

    const closeModalRemove3 = () => {
        setmodalRemoveDocument3Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    }

    const openModalRemove4 = () => {
        setmodalRemoveDocument4Active(true);
    };
    

    const closeModalRemove4 = () => {
        setmodalRemoveDocument4Active(false);
        fetchamountDocuments();
        fetchAmountAlerts();
    }

    const closeAlert = () => {
        localStorage.setItem('isAlertClose', '1');
        navigate("/documentos_por_usuario");
    }

    const showSuccessModify = (myMessage) => {
        setAlert({ message: myMessage, type: "success" });
        setTimeout(() => setAlert(null), 3000); 
    };


    return (
        <>
    <NavBar myUser={username} ></NavBar>
    <div className='navegation-container'>
        <div className="navegation-main-container">
            <NavLink className="no-active" to="/user_panel">Inicio</NavLink>
            <p className="separator">&gt;</p>
            <NavLink className="active" to="#">Mis documentos</NavLink>
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
    <div className="card-container-document">
      <div className="card-document">
        <div className="image-container-document">
            <svg className="image-document" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>
            </svg>
        </div>
        <div className="text-container-document">
          <span className="text-document">Carnet de salud</span>
        </div>
        <div className="footer-document">
            {document1Active && <button type="button" onClick={openModalView1}>Ver</button>}
            {document1Active && <button className="btn-delete-document" type="button" onClick={openModalRemove1}>Eliminar</button>}
            {!document1Active && <button type="button" onClick={openModal}>Agregar</button>}
        </div>
      </div>
      <div className="card-document">
            <div className="image-container-document">
                <svg className="image-document" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                    <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>
                </svg>
            </div>
            <div className="text-container-document">
                <span className="text-document">Habilitaciones</span>
            </div>
            <div className="footer-document">
            {document2Active && <button type="button" onClick={openModalView2}>Ver</button>}
            {document2Active && <button className="btn-delete-document" type="button" onClick={openModalRemove2}>Eliminar</button>}
            {!document2Active && <button type="button" onClick={openModal2}>Agregar</button>}
        </div>
        </div>

        <div className="card-document">
            <div className="image-container-document">
                <svg className="image-document" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                        <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"/>
                </svg>
            </div>
            <div className="text-container-document">
                <span className="text-document">Vacuna tetano</span>
            </div>
            <div className="footer-document">
            {document3Active && <button type="button" onClick={openModalView3}>Ver</button>}
            {document3Active && <button className="btn-delete-document" type="button" onClick={openModalRemove3}>Eliminar</button>}
            {!document3Active && <button type="button" onClick={openModal3}>Agregar</button>}
        </div>
        </div>

        <div className="card-document">
            <div className="image-container-document">
                <img className="image-document" src={imageIdentityCard || "https://www.shutterstock.com/image-vector/black-icon-persons-identity-document-600nw-2438171283.jpg"}></img>
            </div>
            <div className="text-container-document">
                <span className="text-document">Cedula Identidad</span>
            </div>
            <div className="footer-document">
            {document4Active && <button type="button" onClick={openModalView4}>Ver</button>}
            {document4Active && <button className="btn-delete-document" type="button" onClick={openModalRemove4}>Eliminar</button>}
            {!document4Active && <button type="button" onClick={openModal4}>Agregar</button>}
        </div>
        </div>     
        
    </div>

    {modalDocument1Active && <ModalAddDocument1
                closeModal={closeModal}
                idUser={idUser}
                token={token}
                alertMessage={showSuccessModify}
            />}

    {modalDocument2Active && <ModalAddDocument2
                closeModal={closeModal2}
                idUser={idUser}
                token={token}
                alertMessage={showSuccessModify}
            />}

    {modalDocument3Active && <ModalAddDocument3
                closeModal={closeModal3}
                idUser={idUser}
                token={token}
                alertMessage={showSuccessModify}
            />}


    {modalDocument4Active && <ModalAddDocument4
                closeModal={closeModal4}
                idUser={idUser}
                token={token}
                alertMessage={showSuccessModify}
            />}

    {modalViewDocument1Active && <ModalViewDocument1
                closeModal={closeModalView1}
                idUser={idUser}
                token={token}
            />}

    {modalViewDocument2Active && <ModalViewDocument2
                closeModal={closeModalView2}
                idUser={idUser}
                token={token}
            />}

    {modalViewDocument3Active && <ModalViewDocument3
                closeModal={closeModalView3}
                idUser={idUser}
                token={token}
            />}

    {modalViewDocument4Active && <ModalViewDocument4
                closeModal={closeModalView4}
                idUser={idUser}
                token={token}
            />}

    {modalRemoveDocument1Active && <ModalRemoveDocument1
    closeModal={closeModalRemove1}
    idUser={idUser}
    token={token}
    alertMessage={showSuccessModify}
    />}

    {modalRemoveDocument2Active && <ModalRemoveDocument2
    closeModal={closeModalRemove2}
    idUser={idUser}
    token={token}
    alertMessage={showSuccessModify}
    />}

    {modalRemoveDocument3Active && <ModalRemoveDocument3
    closeModal={closeModalRemove3}
    idUser={idUser}
    token={token}
    alertMessage={showSuccessModify}
    />}

    {modalRemoveDocument4Active && <ModalRemoveDocument4
    closeModal={closeModalRemove4}
    idUser={idUser}
    token={token}
    alertMessage={showSuccessModify}
    />}

    {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}


    <Footer></Footer>

    </>
    )
}

export default DocumentUser;