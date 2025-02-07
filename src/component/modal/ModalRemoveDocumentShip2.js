import React, { useState, useEffect } from "react";
import axios from 'axios';

const ModalRemoveDocumentShip2 = ({closeModal, idShip, token, alertMessage}) => {

        const [loading, setLoading] = useState(false);
        const [dots, setDots] = useState('');

        const myAPI = "http://localhost:8115";

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
            
            const response = await axios.delete(
                `${myAPI}/certificate_navigability/delete_document`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdShip: idShip, pType: "2" },
                }
            );
    
            if (response.status === 200) {
                console.log(response.data.message || 'Documento eliminado correctamente.');
                alertMessage(response.data.message);
            } else {
                console.error("No se pudo eliminar el documento.");
            }
        } catch (error) {
            console.error('Error al intentar eliminar el documento:', error);
        } finally {
            closeModal();
            setLoading(false);
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
                    {!loading && <p>Estas seguro que quieres eliminar el documento <strong>certificado de navegabilidad</strong>?</p> }
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

export default ModalRemoveDocumentShip2;