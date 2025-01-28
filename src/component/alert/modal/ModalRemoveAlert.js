import React, { useState, useEffect } from "react";
import axios from 'axios';

const ModalRemoveAlert = ({closeModal, alertToDelete, token}) => {

    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');

     useEffect(() => {
                    const interval = setInterval(() => {
                        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
                    }, 400); // Cambia cada 500ms
                
                    return () => clearInterval(interval); // Limpia el intervalo al desmontar
                }, []);
    
    const deleteAlert = async () => {
        if (!alertToDelete || !token) {
            console.error('Faltan valores requeridos (alertToDelete o token)');
            return;
        }

        setLoading(true);
    
        try {
            const response = await axios.delete(
                "http://localhost:8115/alert/delete",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdAlert: alertToDelete.id },
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
                    <h1>Remover alerta</h1>
                </div>
                <div className="body-container">
                    {!loading && <p>Estas seguro que quieres eliminar la alerta <strong>{alertToDelete.type}</strong>?</p> }
                    {loading && <p>Eliminado{dots}</p>}
                </div>
                <div className="footer-container">
                    <button onClick={closeModal} disabled={loading}>Cancelar</button>
                    <button onClick={deleteAlert} id="delete-btn" type="button" disabled={loading}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalRemoveAlert;