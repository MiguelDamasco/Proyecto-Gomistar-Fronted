import React, { useState } from 'react';
import axios from 'axios';

const ModalAddDocumentShip4 = ({ closeModal, idShip, token }) => {
    const [expirationDate, setExpirationDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');


    const validateForm = () => {
        const today = new Date();
        const selectedDate = new Date(expirationDate);

        if (!selectedFile) {
            setErrorMessage('Por favor, seleccione un archivo.');
            return false;
        }

        console.log("fecha: " + selectedDate);

        if (isNaN(selectedDate.getTime())) {
            setErrorMessage('Ingrese una fecha de expiración válida.');
            return false;
        }

        if (selectedDate <= today) {
            setErrorMessage('La fecha de expiración debe ser mayor a la fecha actual.');
            return false;
        }

        setErrorMessage('');
        return true;
    };


    const handleSubmit = async () => {
        if (validateForm()) {
            setExpirationDate(adjustDateToGMTMinus0300(expirationDate));
            console.log("nueva fecha: " + expirationDate);
            console.log('Formulario enviado con éxito');
            const formData = new FormData();
            formData.append('pIdShip', idShip);  // El id del barco
            formData.append('pFile', selectedFile);  // El archivo
            formData.append('pExpirationDate', expirationDate);  // La fecha de expiración
            formData.append('pDocumentNumber', "4"); 

            try {
                const response = await axios.post('http://localhost:8115/ship/add_document', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`  // Si estás utilizando JWT para la autorización
                    }
                });

                if (response.status === 200) {
                    console.log('Documento agregado con éxito');
                    closeModal();
                } else {
                    console.error('Error al agregar el documento');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
            }
        }
    };

    const adjustDateToGMTMinus0300 = (date) => {
        // Crear un objeto Date con la fecha actual
        const localDate = new Date(date);
    
        // Obtener el desplazamiento en minutos de la zona horaria local
        const timeOffset = localDate.getTimezoneOffset();
    
        // Ajustar la fecha para que esté en GMT-0300
        const adjustedDate = new Date(localDate.getTime() + (timeOffset + 180) * 60000); // 180 minutos es el desplazamiento para GMT-0300
    
        // Devolver la fecha ajustada en formato YYYY-MM-DD
        return adjustedDate.toISOString().split('T')[0];
    };

    

    return (
        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Agregar Documento</h1>
                </div>
                <div className="body-container">
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button type="button" onClick={handleSubmit}>Agregar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddDocumentShip4;