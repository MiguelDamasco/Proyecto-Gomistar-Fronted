import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalAddDocument1 = ({ closeModal, idUser, token, alertMessage }) => {
    const [expirationDate, setExpirationDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const myAPI = "http://localhost:8115";

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 400); // Cambia cada 500ms
    
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, []);


    const validateForm = () => {
        const today = new Date();
        const selectedDate = new Date(expirationDate);

        if (!selectedFile) {
            setErrorMessage('Por favor, seleccione un archivo.');
            return false;
        }

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
            setLoading(true);
            setExpirationDate(adjustDateToGMTMinus0300(expirationDate));
        
            const formData = new FormData();
            formData.append('pIdUser', idUser);
            formData.append('pFile', selectedFile);
            formData.append('pDate', expirationDate);
            formData.append('pNumber', "1");

            try {
                const response = await axios.post(`${myAPI}/user/add_document`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 201) {
                    console.log('Documento agregado con éxito');
                    alertMessage(response.data.message);
                } else {
                    console.error('Error al agregar el documento');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
            } finally {
                closeModal();
                setLoading(false);
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
        <div className="modal-background-container">
            <div className="modal-main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="modal-title-container">
                    <h1>Agregar Documento</h1>
                </div>
               {!loading && <div className="modal-body-container">
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div> }
                {loading && <div className="modal-body-container">
                    <p style={{ color: 'gray', fontSize: '16px'}}>Cargando{dots}</p> 
                </div> }
                <div className="modal-footer-container">
                    <button onClick={closeModal} disabled={loading}>Cancelar</button>
                    <button type="button" onClick={handleSubmit} disabled={loading}>Agregar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddDocument1;