import React, { useState, useEffect } from "react";
import NavBar from "./NavBarComponent";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import ModalAddDocumentShip1 from "./modal/ModalAddDocuemntShip1";
import ModalAddDocumentShip2 from "./modal/ModalAddDocumentShip2";
import ModalAddDocumentShip3 from "./modal/ModalAddDocumentShip3";
import ModalAddDocumentShip4 from "./modal/ModalAddDocumentShip4";
import ModalAddDocumentShip5 from "./modal/ModalAddDocumentShip5";
import ModalAddDocumentShip6 from "./modal/ModalAddDocumentShip6";
import ModalViewDocumentShip1 from "./modal/ModalViewDocumentShip1";
import ModalViewDocumentShip2 from "./modal/ModalViewDocumentShip2";
import ModalViewDocumentShip3 from "./modal/ModalViewDocumentShip3";
import ModalViewDocumentShip4 from "./modal/ModalViewDocumentShip4";
import ModalViewDocumentShip5 from "./modal/ModalViewDocumentShip5";
import ModalViewDocumentShip6 from "./modal/ModalViewDocumentShip6";
import ModalRemoveDocumentShip1 from "./modal/ModalRemoveDocumentShip1";
import ModalRemoveDocumentShip2 from "./modal/ModalRemoveDocumentShip2";
import ModalRemoveDocumentShip3 from "./modal/ModalRemoveDocumentShip3";
import ModalRemoveDocumentShip4 from "./modal/ModalRemoveDocumentShip4";
import ModalRemoveDocumentShip5 from "./modal/ModalRemoveDocumentShip5";
import ModalRemoveDocumentShip6 from "./modal/ModalRemoveDocumentShip6";
import "../css/NavBar.css";
import "../css/DocumentsShip.css";


const ShipDocuments = () => {

    const [amountDocuments, setAmounDocuments] = useState([]);
    const [document1Active, setDocument1Active] = useState(false);
    const [document2Active, setDocument2Active] = useState(false);
    const [document3Active, setDocument3Active] = useState(false);
    const [document4Active, setDocument4Active] = useState(false);
    const [document5Active, setDocument5Active] = useState(false);
    const [document6Active, setDocument6Active] = useState(false);
    const [modalDocument1Active, setmodalDocument1Active] = useState(false);
    const [modalDocument2Active, setmodalDocument2Active] = useState(false);
    const [modalDocument3Active, setmodalDocument3Active] = useState(false);
    const [modalDocument4Active, setmodalDocument4Active] = useState(false);
    const [modalDocument5Active, setmodalDocument5Active] = useState(false);
    const [modalDocument6Active, setmodalDocument6Active] = useState(false);
    const [modalViewDocument1Active, setmodalViewDocument1Active] = useState(false);
    const [modalViewDocument2Active, setmodalViewDocument2Active] = useState(false);
    const [modalViewDocument3Active, setmodalViewDocument3Active] = useState(false)
    const [modalViewDocument4Active, setmodalViewDocument4Active] = useState(false);
    const [modalViewDocument5Active, setmodalViewDocument5Active] = useState(false);
    const [modalViewDocument6Active, setmodalViewDocument6Active] = useState(false);
    const [modalRemoveDocument1Active, setmodalRemoveDocument1Active] = useState(false);
    const [modalRemoveDocument2Active, setmodalRemoveDocument2Active] = useState(false);
    const [modalRemoveDocument3Active, setmodalRemoveDocument3Active] = useState(false);
    const [modalRemoveDocument4Active, setmodalRemoveDocument4Active] = useState(false);
    const [modalRemoveDocument5Active, setmodalRemoveDocument5Active] = useState(false);
    const [modalRemoveDocument6Active, setmodalRemoveDocument6Active] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const username = localStorage.getItem('username');
    const idShip = localStorage.getItem('idShip');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Obtener tipos de carga desde la API

        fetchamountDocuments();
    }, [token, idShip]);

    const fetchamountDocuments = async () => {

        if (!idShip || !token) {
            console.error('Faltan valores requeridos (idShip o token)');
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:8115/ship/amount_documents",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pId: idShip },
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


    const deleteDocument = async () => {
        if (!idShip || !token) {
            console.error('Faltan valores requeridos (idShip o token)');
            return;
        }
    
        try {
            // Realizar la solicitud DELETE al endpoint
            const response = await axios.delete(
                "http://localhost:8115/boat_registration/delete_document",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdShip: idShip },
                }
            );
    
            if (response.status === 200) {
                console.log(response.data.message || 'Documento eliminado correctamente.');
                closeModalRemove1();
                fetchamountDocuments();
            } else {
                console.error("No se pudo eliminar el documento.");
            }
        } catch (error) {
            console.error('Error al intentar eliminar el documento:', error);
        }
    };
    

    const checkDocuments = async (data) => {
        if (data.length > 0) {
            setDocument1Active(data[0] !== null);
            setDocument2Active(data[1] !== null);
            setDocument3Active(data[2] !== null);
            setDocument4Active(data[3] !== null);
            setDocument5Active(data[4] !== null);
            setDocument6Active(data[5] !== null);
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
    };

    const openModal5 = () => {
        setmodalDocument5Active(true);
    };

    const closeModal5 = () => {
        setmodalDocument5Active(false);
        fetchamountDocuments();
    };
    
    const openModal6 = () => {
        setmodalDocument6Active(true);
    };

    const closeModal6 = () => {
        setmodalDocument6Active(false);
        fetchamountDocuments();
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

    const openModalView3 = () => {
        setmodalViewDocument3Active(true);
    };

    const closeModalView4 = () => {
        setmodalViewDocument4Active(false);
        fetchamountDocuments();
    };

    const openModalView4 = () => {
        setmodalViewDocument4Active(true);
    };

    const closeModalView5 = () => {
        setmodalViewDocument5Active(false);
        fetchamountDocuments();
    };

    const openModalView5 = () => {
        setmodalViewDocument5Active(true);
    };

    const closeModalView6 = () => {
        setmodalViewDocument6Active(false);
        fetchamountDocuments();
    };

    const openModalView6 = () => {
        setmodalViewDocument6Active(true);
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
    }

    const openModalRemove5 = () => {
        setmodalRemoveDocument5Active(true);
    };
    

    const closeModalRemove5 = () => {
        setmodalRemoveDocument5Active(false);
        fetchamountDocuments();
    }

    const openModalRemove6 = () => {
        setmodalRemoveDocument6Active(true);
    };
    

    const closeModalRemove6 = () => {
        setmodalRemoveDocument6Active(false);
        fetchamountDocuments();
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
          <span className="text-ship">Lanchas de transporte</span>
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
                <span className="text-ship">Barcos de carga</span>
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
                <span className="text-ship">Barcos de carga</span>
            </div>
            <div className="footer-ship">
            {document3Active && <button type="button" onClick={openModalView3}>Ver</button>}
            {document3Active && <button type="button" onClick={openModalRemove3}>Eliminar</button>}
            {!document3Active && <button type="button" onClick={openModal3}>Agregar</button>}
        </div>
        </div>

        <div class="card">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Barcos de carga</span>
            </div>
            <div className="footer-ship">
            {document4Active && <button type="button" onClick={openModalView4}>Ver</button>}
            {document4Active && <button type="button" onClick={openModalRemove4}>Eliminar</button>}
            {!document4Active && <button type="button" onClick={openModal4}>Agregar</button>}
        </div>
        </div>

        <div class="card">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Barcos de carga</span>
            </div>
            <div className="footer-ship">
            {document5Active && <button type="button" onClick={openModalView5}>Ver</button>}
            {document5Active && <button type="button" onClick={openModalRemove5}>Eliminar</button>}
            {!document5Active && <button type="button" onClick={openModal5}>Agregar</button>}
        </div>
        </div>

        <div class="card">
            <div className="image-container">
                <img className="image-ship" src="https://images.vexels.com/content/166188/preview/cargo-ship-line-3c57c2.png"></img>
            </div>
            <div className="text-container">
                <span className="text-ship">Barcos de carga</span>
            </div>
            <div className="footer-ship">
            {document6Active && <button type="button" onClick={openModalView6}>Ver</button>}
            {document6Active && <button type="button" onClick={openModalRemove6}>Eliminar</button>}
            {!document6Active && <button type="button" onClick={openModal6}>Agregar</button>}
        </div>
        </div>

        
        
    </div>

    {modalDocument1Active && <ModalAddDocumentShip1
                closeModal={closeModal}
                idShip={idShip}
                token={token}
            />}

    {modalDocument2Active && <ModalAddDocumentShip2
                closeModal={closeModal2}
                idShip={idShip}
                token={token}
            />}

    {modalDocument3Active && <ModalAddDocumentShip3
                closeModal={closeModal3}
                idShip={idShip}
                token={token}
            />}

    
    {modalDocument4Active && <ModalAddDocumentShip4
                closeModal={closeModal4}
                idShip={idShip}
                token={token}
            />}

    {modalDocument5Active && <ModalAddDocumentShip5
                closeModal={closeModal5}
                idShip={idShip}
                token={token}
            />}

    {modalDocument6Active && <ModalAddDocumentShip6
                closeModal={closeModal6}
                idShip={idShip}
                token={token}
            />}

    {modalViewDocument1Active && <ModalViewDocumentShip1
                closeModal={closeModalView1}
                idShip={idShip}
                token={token}
            />}

    {modalViewDocument2Active && <ModalViewDocumentShip2
                closeModal={closeModalView2}
                idShip={idShip}
                token={token}
            />}


    {modalViewDocument3Active && <ModalViewDocumentShip3
                closeModal={closeModalView3}
                idShip={idShip}
                token={token}
            />}

    {modalViewDocument4Active && <ModalViewDocumentShip4
                closeModal={closeModalView4}
                idShip={idShip}
                token={token}
            />}

    {modalViewDocument5Active && <ModalViewDocumentShip5
                closeModal={closeModalView5}
                idShip={idShip}
                token={token}
            />}

    {modalViewDocument6Active && <ModalViewDocumentShip6
                closeModal={closeModalView6}
                idShip={idShip}
                token={token}
            />}

    {modalRemoveDocument1Active && <ModalRemoveDocumentShip1
    closeModal={closeModalRemove1}
    removeDocument={deleteDocument}
    />}

    {modalRemoveDocument2Active && <ModalRemoveDocumentShip2
    closeModal={closeModalRemove2}
    idShip={idShip}
    token={token}
    />}

    {modalRemoveDocument3Active && <ModalRemoveDocumentShip3
    closeModal={closeModalRemove3}
    idShip={idShip}
    token={token}
    />}

    {modalRemoveDocument4Active && <ModalRemoveDocumentShip4
    closeModal={closeModalRemove4}
    idShip={idShip}
    token={token}
    />}

    {modalRemoveDocument5Active && <ModalRemoveDocumentShip5
    closeModal={closeModalRemove5}
    idShip={idShip}
    token={token}
    />}

    {modalRemoveDocument6Active && <ModalRemoveDocumentShip6
    closeModal={closeModalRemove6}
    idShip={idShip}
    token={token}
    />}
    </>
    )
}

export default ShipDocuments;