import React, { useState, useEffect } from "react";
import axios from 'axios';

const ModalRemoveDocumentShip6 = ({closeModal, idShip, token}) => {

    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');
    
    useEffect(() => {
            const interval = setInterval(() => {
                    setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
                }, 400); // Cambia cada 500ms
                    
                return () => clearInterval(interval); // Limpia el intervalo al desmontar
            }, []);

    const deleteDocument = async () => {
        if (!idShip || !token) {
            console.error('Faltan valores requeridos (idShip o token)');
            return;
        }

        setLoading(true);
    
        try {
            // Realizar la solicitud DELETE al endpoint
            const response = await axios.delete(
                "http://localhost:8115/minimum_security_equipment/delete_document",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdShip: idShip, pType: "6" },
                }
            );
    
            if (response.status === 200) {
                console.log(response.data.message || 'Documento eliminado correctamente.');
            } else {
                console.error("No se pudo eliminar el documento.");
            }
        } catch (error) {
            console.error('Error al intentar eliminar el documento:', error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (

        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Remover documento</h1>
                </div>
                <div className="body-container">
                    {!loading && <p>Estas seguro que quieres eliminar el documento <strong>Certificado equipo de seguridad minimo</strong>?</p> }
                    {loading && <p>Eliminado{dots}</p>}
                </div>
                <div className="footer-container">
                    <button onClick={closeModal} disabled={loading}>Cancelar</button>
                    <button onClick={deleteDocument} id="delete-btn" type="button" disabled={loading}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalRemoveDocumentShip6;