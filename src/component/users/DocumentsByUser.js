import React, { useState, useEffect } from "react";
import NavBar from "./../NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import ModalAddDocument1 from "./modal/ModalAddDocument1";
import ModalViewDocument1 from "./modal/ModalViewDocument1";
import ModalRemoveDocument1 from "./modal/ModalRemoveDocument1";
import ModalAddDocument2 from "./modal/ModalAddDocument2";
import ModalViewDocument2 from "./modal/ModalViewDocument2";
import ModalRemoveDocument2 from "./modal/ModalRemoveDocument2";
import ModalAddDocument3 from "./modal/ModalAddDocument3";
import ModalViewDocument3 from "./modal/ModalViewDocument3";
import ModalRemoveDocument3 from "./modal/ModalRemoveDocument3";
import ModalAddDocument4 from "./modal/ModalAddDocument4";
import ModalViewDocument4 from "./modal/ModalViewDocument4";
import ModalRemoveDocument4 from "./modal/ModalRemoveDocument4";
import "../../css/NavBar.css";
import "../../css/DocumentsShip.css";


const DocumentsByUserComponent = () => {

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
    const [selectedFile, setSelectedFile] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const username = localStorage.getItem('username');
    const idUser = localStorage.getItem('idUser');
    const token = localStorage.getItem('token');
    let imageIdentityCard = localStorage.getItem('identity_card') || '';
    const navigate = useNavigate();


    useEffect(() => {
        // Obtener tipos de carga desde la API

        fetchamountDocuments();
        //getImageIdentityCard();
        console.log("mi idUser: " + idUser);
    }, [token, idUser]);


    useEffect(() => {

        fetchImageIdentityCard();
    }, [token, idUser]);


    const fetchImageIdentityCard = async () => {
        if (!idUser || !token) {
            console.error('Faltan valores requeridos (idUser o token)');
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:8115/identity_card/image",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdUser: idUser },
                }
            );

            if (response.data.value != null) {
                localStorage.setItem('identity_card', response.data.value);
            }
            console.log("Informacion: " + response.data.value);
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
                "http://localhost:8115/user/amount_documents",
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
            }
            console.log("Informacion: " + response.data.value);
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
    };

    const openModal3 = () => {
        setmodalDocument3Active(true);
    };

    const closeModal3 = () => {
        setmodalDocument3Active(false);
        fetchamountDocuments();
    };

    const openModal4 = () => {
        setmodalDocument4Active(true);
    };

    const closeModal4 = () => {
        setmodalDocument4Active(false);
        fetchamountDocuments();
        localStorage.setItem('identity_card', '');
        window.location.reload();
    };



    const closeModalView1 = () => {
        setmodalViewDocument1Active(false);
        fetchamountDocuments();
    };

    const openModalView1 = () => {
        setmodalViewDocument1Active(true);
    };

    const closeModalView2 = () => {
        setmodalViewDocument2Active(false);
        fetchamountDocuments();
    };

    const openModalView2 = () => {
        setmodalViewDocument2Active(true);
    };

    const closeModalView3 = () => {
        setmodalViewDocument3Active(false);
        fetchamountDocuments();
    };

    const openModalView4 = () => {
        setmodalViewDocument4Active(true);
    };

    const closeModalView4 = () => {
        setmodalViewDocument4Active(false);
        fetchamountDocuments();
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
    }

    const openModalRemove2 = () => {
        setmodalRemoveDocument2Active(true);
    };
    

    const closeModalRemove2 = () => {
        setmodalRemoveDocument2Active(false);
        fetchamountDocuments();
    }

    const openModalRemove3 = () => {
        setmodalRemoveDocument3Active(true);
    };
    

    const closeModalRemove3 = () => {
        setmodalRemoveDocument3Active(false);
        fetchamountDocuments();
    }

    const openModalRemove4 = () => {
        setmodalRemoveDocument4Active(true);
    };
    

    const closeModalRemove4 = () => {
        setmodalRemoveDocument4Active(false);
        fetchamountDocuments();
        localStorage.setItem('identity_card', '');
    }


    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleExpirationDateChange = (e) => {
        setExpirationDate(e.target.value);
    };



    return (
        <>
    <NavBar myUser={username} ></NavBar>
   <div className='navegation-container'>
      <NavLink className="no-active" to="/admin_panel">Inicio</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="no-active" to="/barcos">Embarcaciones</NavLink>
      <p className="separator">&gt;</p>
      <NavLink className="active" to="#">Panel tripulantes</NavLink>
      <p className="hidden-separator">&gt;</p>
   </div>
    <div className="card-container">
      <div class="card">
        <div className="image-container">
          <img className="image-ship" src="https://cdn5.dibujos.net/dibujos/pintar/una-lancha_2.png"></img>
        </div>
        <div className="text-container">
          <span className="text-ship">Carnet de salud</span>
        </div>
        <div className="footer-ship">
            {document1Active && <button type="button" onClick={openModalView1}>Ver</button>}
            {document1Active && <button type="button" onClick={openModalRemove1}>Eliminar</button>}
            {!document1Active && <button type="button" onClick={openModal}>Agregar</button>}
        </div>
      </div>
      <div class="card">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Habilitaciones</span>
            </div>
            <div className="footer-ship">
            {document2Active && <button type="button" onClick={openModalView2}>Ver</button>}
            {document2Active && <button type="button" onClick={openModalRemove2}>Eliminar</button>}
            {!document2Active && <button type="button" onClick={openModal2}>Agregar</button>}
        </div>
        </div>

        <div class="card">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Vacuna tetano</span>
            </div>
            <div className="footer-ship">
            {document3Active && <button type="button" onClick={openModalView3}>Ver</button>}
            {document3Active && <button type="button" onClick={openModalRemove3}>Eliminar</button>}
            {!document3Active && <button type="button" onClick={openModal3}>Agregar</button>}
        </div>
        </div>

        <div class="card">
            <div className="image-container">
                <img className="image-ship" src={imageIdentityCard || "https://www.shutterstock.com/image-vector/black-icon-persons-identity-document-600nw-2438171283.jpg"}></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Cedula Identidad</span>
            </div>
            <div className="footer-ship">
            {document4Active && <button type="button" onClick={openModalView4}>Ver</button>}
            {document4Active && <button type="button" onClick={openModalRemove4}>Eliminar</button>}
            {!document4Active && <button type="button" onClick={openModal4}>Agregar</button>}
        </div>
        </div>     
        
    </div>

    {modalDocument1Active && <ModalAddDocument1
                closeModal={closeModal}
                idUser={idUser}
                token={token}
            />}

    {modalDocument2Active && <ModalAddDocument2
                closeModal={closeModal2}
                idUser={idUser}
                token={token}
            />}

    {modalDocument3Active && <ModalAddDocument3
                closeModal={closeModal3}
                idUser={idUser}
                token={token}
            />}


    {modalDocument4Active && <ModalAddDocument4
                closeModal={closeModal4}
                idUser={idUser}
                token={token}
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
    />}

    {modalRemoveDocument2Active && <ModalRemoveDocument2
    closeModal={closeModalRemove2}
    idUser={idUser}
    token={token}
    />}

    {modalRemoveDocument3Active && <ModalRemoveDocument3
    closeModal={closeModalRemove3}
    idUser={idUser}
    token={token}
    />}

    {modalRemoveDocument4Active && <ModalRemoveDocument4
    closeModal={closeModalRemove4}
    idUser={idUser}
    token={token}
    />}

    </>
    )
}

export default DocumentsByUserComponent;