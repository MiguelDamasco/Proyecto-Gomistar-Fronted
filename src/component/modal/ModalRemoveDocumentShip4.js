import React from "react";
import axios from 'axios';

const ModalRemoveDocumentShip4 = ({closeModal, idShip, token}) => {


    const deleteDocument = async () => {
        if (!idShip || !token) {
            console.error('Faltan valores requeridos (idShip o token)');
            return;
        }
    
        try {
            // Realizar la solicitud DELETE al endpoint
            const response = await axios.delete(
                "http://localhost:8115/mandatory_insurance/delete_document",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdShip: idShip },
                }
            );
    
            if (response.status === 200) {
                console.log(response.data.message || 'Documento eliminado correctamente.');
                closeModal();
            } else {
                console.error("No se pudo eliminar el documento.");
            }
        } catch (error) {
            console.error('Error al intentar eliminar el documento:', error);
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
                    <p>Estas seguro que quieres eliminar el documento <strong>seguro obligatorio</strong>?</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={deleteDocument} id="delete-btn" type="button">Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalRemoveDocumentShip4;