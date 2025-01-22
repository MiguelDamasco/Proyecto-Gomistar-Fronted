import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalViewDocument4 = ({ closeModal, idUser, token }) => {
    const [expirationDate, setExpirationDate] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lectureData, setLectureData] = useState({});
    const [dots, setDots] = useState('');
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 400);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8115/identity_card/get', {
                    params: { pIdUser: idUser },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { value } = response.data;
                setLectureData({
                    name: value.name || '',
                    lastname: value.lastname || '',
                    nationality: value.nationality || '',
                    identityNumber: value.identityNumber || '',
                    birthday: value.birthday || '',
                    expeditionDate: value.expeditionDate || '',
                    expirationData: value.expirationData || '',
                });
            } catch (err) {
                console.error('Error al obtener el documento:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [idUser, token]);
    
    const downloadDocument = async () => {
        try {
            const response = await axios.get('http://localhost:8115/identity_card/download_image', {
                params: { pIdUser: idUser },
                headers: { Authorization: `Bearer ${token}` },
            });
            const presignedUrl = response.data.value;
            console.log("url a descargar: " + presignedUrl);
            const link = document.createElement('a');
            link.href = presignedUrl;
            link.download = `document-${idUser}`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error al descargar el documento:', err);
        }
    };
    
    return (
        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Mi Documento</h1>
                </div>
                {!loading && lectureData && (
                    <div className="body-container">
                        <div className="full-name-container">
                            <label>Nombres: </label>
                            <p>{lectureData.name || 'N/A'}</p>
                        </div>
                        <div className="lastname-container">
                            <label>Apellidos: </label>
                            <p>{lectureData.lastname || 'N/A'}</p>
                        </div>
                        <div className="nationality-container">
                            <label>Nacionalidad: </label>
                            <p>{lectureData.nationality || 'N/A'}</p>
                        </div>
                        <div className="identityNumber-container">
                            <label>Número identidad: </label>
                            <p>{lectureData.identityNumber || 'N/A'}</p>
                        </div>
                        <div className="birthday-container">
                            <label>Fecha nacimiento: </label>
                            <p>{lectureData.birthday || 'N/A'}</p>
                        </div>
                        <div className="expedition-date-container">
                            <label>Fecha expedición: </label>
                            <p>{lectureData.expeditionDate || 'N/A'}</p>
                        </div>
                        <div className="expiration-date-container">
                            <label>Fecha expiración: </label>
                            <p>{lectureData.expirationData || 'N/A'}</p>
                        </div>
                    </div>
                )}
                {loading && (
                    <div className="body-container">
                        <p>Cargando{dots}</p>
                    </div>
                )}
                <div className="footer-container">
                    <button onClick={closeModal} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="button" onClick={downloadDocument} disabled={loading}>
                        Descargar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalViewDocument4;
