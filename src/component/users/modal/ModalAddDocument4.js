import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../css/modal/ViewIdentityCardModal.css";

const ModalAddDocument4 = ({ closeModal, idUser, token, alertMessage }) => {
    const [expirationDate, setExpirationDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [firstStage, setFirstStage] = useState(true);
    const [secondStage, setSecondStage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const file_search = localStorage.getItem('identity_card') || '';
    const [lectureData, setLectureData] = useState({
        name: '',
        lastname: '',
        nationality: '',
        identityNumber: '',
        birthday: '',
        expeditionDate: '',
        expirationData: '',
    });


    const myAPI = "http://localhost:8115";

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 400);

        return () => clearInterval(interval);
    }, []);

    const existFile = () => {
        if (!selectedFile) {
            setErrorMessage('Por favor, seleccione un archivo.');
            return false;
        }
        return true;
    };

    const convertToISODate = (dateString) => {
        // Verificar si la fecha tiene el formato correcto
        const dateParts = dateString.split('/');
        if (dateParts.length !== 3) {
            throw new Error('El formato de la fecha debe ser dd/mm/yyyy');
        }
    
        const [day, month, year] = dateParts;
    
        // Crear el formato ISO yyyy-mm-dd
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };    
    
    const lecture = async () => {
        if (existFile()) {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('pFile', selectedFile);
                
                const response = await axios.post(`${myAPI}/identity_card/lecture`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    
                    if (response.data && response.data.value) {
                        setLectureData({
                            name: response.data.value.name || '',
                            lastname: response.data.value.lastname || '',
                            nationality: response.data.value.nationality || '',
                            identityNumber: response.data.value.identityNumber || '',
                            birthday: convertToISODate(response.data.value.birthday) || '',
                            expeditionDate: convertToISODate(response.data.value.expeditionDate) || '',
                            expirationData: convertToISODate(response.data.value.expirationData) || '',
                        });
                        localStorage.setItem('identity_card', response.data.value.image);
                    }
                    setFirstStage(false);
                    setSecondStage(true);
                    setErrorMessage('');
                } else {
                    console.error('Error en la lectura del documento:', response);
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.response?.data || error.message);
                setErrorMessage('Ingrese una imágen completa de su cedula de identidad');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            
            const formattedBirthday = new Date(lectureData.birthday);
            const formattedExpeditionDate = new Date(lectureData.expeditionDate);
            const formattedExpirationData = new Date(lectureData.expirationData);
    
            if (isNaN(formattedBirthday) || isNaN(formattedExpeditionDate) || isNaN(formattedExpirationData)) {
                setErrorMessage('Una o más fechas son inválidas.');
                return;
            }
    
            const payload = {
                ...lectureData,
                birthday: formattedBirthday.toISOString().split('T')[0],
                expeditionDate: formattedExpeditionDate.toISOString().split('T')[0],
                expirationData: formattedExpirationData.toISOString().split('T')[0],
                expirationDate: adjustDateToGMTMinus0300(expirationDate),
                idUser: idUser,
                file: file_search
            };
    
            const response = await axios.post(`${myAPI}/identity_card/create`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                alertMessage(response.data.message);
                closeModal();
            } else {
                console.error('Error al crear el documento:', response);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const adjustDateToGMTMinus0300 = (date) => {
        const localDate = new Date(date);
        // Verifica si la fecha es válida antes de ajustarla
        if (isNaN(localDate.getTime())) {
            console.error("Fecha inválida:", date);
            return null; // O puedes asignar una fecha por defecto, si es necesario
        }
        const timeOffset = localDate.getTimezoneOffset();
        const adjustedDate = new Date(localDate.getTime() + (timeOffset + 180) * 60000);
        return adjustedDate.toISOString().split('T')[0]; // Retorna solo la fecha en formato ISO
    };

    const cancelUpload = async () => {

        closeModal();
        const fileToCancel = localStorage.getItem('identity_card');
    
        if (!fileToCancel) {
            console.error("No hay archivo para cancelar.");
            setErrorMessage("No hay archivo seleccionado para cancelar.");
            return;
        }

        try {
            const response = await axios.delete(`${myAPI}/identity_card/cancel`, {
                params: { pFile: fileToCancel },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                
                localStorage.setItem('identity_card', '');
                setLectureData({
                    name: '',
                    lastname: '',
                    nationality: '',
                    identityNumber: '',
                    birthday: '',
                    expeditionDate: '',
                    expirationData: '',
                });
            } else {
                console.error("Error al cancelar:", response);
                setErrorMessage("Error al cancelar el documento.");
            }
        } catch (error) {
            console.error("Error en la solicitud de cancelación:", error.response?.data || error.message);
            setErrorMessage("No se pudo cancelar el documento. Intente nuevamente.");
        }

    }

    return (
        <div className="modal-background-container">
            <div className="modal-main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="modal-title-container">
                    <h1>Agregar Documento</h1>
                </div>
                {!loading && firstStage && (
                    <div className="modal-body-container">
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                )}
                {loading && firstStage && (
                    <div className="modal-body-container">
                        <p style={{ color: 'black' }}>Analizando{dots}</p>
                    </div>
                )}
                {!loading && secondStage && (
                    <div className="modal-body-container">
                        <div className="name-container">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={lectureData.name}
                                onChange={(e) => setLectureData({ ...lectureData, name: e.target.value })}
                            />
                        </div>
                        <div className="apellido-container">
                            <label>Apellido</label>
                            <input
                                type="text"
                                value={lectureData.lastname}
                                onChange={(e) => setLectureData({ ...lectureData, lastname: e.target.value })}
                            />
                        </div>
                        <div className="nationality-container">
                            <label>Nacionalidad</label>
                            <input
                                type="text"
                                value={lectureData.nationality}
                                onChange={(e) => setLectureData({ ...lectureData, nationality: e.target.value })}
                            />
                        </div>
                        <div className="identity-number-container">
                            <label>Número de identidad</label>
                            <input
                                type="text"
                                value={lectureData.identityNumber}
                                onChange={(e) => setLectureData({ ...lectureData, identityNumber: e.target.value })}
                            />
                        </div>
                        <div className="birthday-container">
    <label>Nacimiento</label>
    <input
        type="date"
        className="input-birthday"
        value={lectureData.birthday || ''}
        onChange={(e) => setLectureData({ ...lectureData, birthday: e.target.value })}
    />
</div>
<div className="expedition-container">
    <label>Expedición</label>
    <input
        type="date"
        className="input-expedition"
        value={lectureData.expeditionDate || ''}
        onChange={(e) => setLectureData({ ...lectureData, expeditionDate: e.target.value })}
    />
</div>
<div className="expiration-container">
    <label>Expiración</label>
    <input
        type="date"
        className="input-expiration"
        value={lectureData.expirationData || ''}
        onChange={(e) => setLectureData({ ...lectureData, expirationData: e.target.value })}
    />
</div>
                        {errorMessage.length > 0 && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                )}
                {firstStage && (
                    <div className="modal-footer-container">
                        <button onClick={closeModal} disabled={loading}>Cancelar</button>
                        <button type="button" onClick={lecture} disabled={loading}>Agregar</button>
                    </div>
                )}
                {secondStage && (
                    <div className="modal-footer-container">
                        <button onClick={cancelUpload} disabled={loading}>Cancelar</button>
                        <button type="button" onClick={handleSubmit} disabled={loading}>Confirmar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalAddDocument4;
