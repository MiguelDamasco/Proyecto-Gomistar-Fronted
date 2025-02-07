import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalViewDocumentShip3 = ({ closeModal, idShip, token }) => {

    const [expirationDate, setExpirationDate] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');

    const myAPI = "http://localhost:8115";

    useEffect(() => {
            const interval = setInterval(() => {
                    setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
                }, 400); // Cambia cada 500ms
                         
                return () => clearInterval(interval); // Limpia el intervalo al desmontar
            }, []);


    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try { 
                const response = await axios.get(`${myAPI}/technical_inspection/get_document`, {
                    params: { pIdShip: idShip },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const { value } = response.data; // Extraemos la propiedad `value` de la respuesta
                setExpirationDate(value.date);
                setImage(value.image); // URL de la imagen
            } catch (err) {
                console.log('Error al obtener el documento');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [idShip, token]);


    const downloadDocument = async () => {
        try {
            
            const response = await axios.get(`${myAPI}/technical_inspection/download_image`, {
                params: { pIdShip: idShip },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const presignedUrl = response.data.value;
            
            // Crear un enlace para forzar la descarga
            const link = document.createElement('a');
            link.href = presignedUrl; // URL del archivo
           link.download = `document-${idShip}`; // Nombre sugerido para el archivo
           link.style.display = 'none'; // No mostrar el enlace en la página
           document.body.appendChild(link); // Agregar el enlace al DOM
           link.click(); // Forzar el clic para descargar el archivo
            document.body.removeChild(link); // Eliminar el enlace después de usarlo
        } catch (err) {
            console.error('Error al descargar el documento:', err);
        }
    };
    
    
    return (
        <div className="modal-background-container">
            <div className="modal-main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="modal-title-container">
                    <h1>Mi Documento</h1>
                </div>
                <div className="modal-body-container">
                    {!loading && <div className="modal-body-container">
                            <img src={image} alt="Documento" style={{ maxWidth: '100%' }}></img>
                            <hr></hr>
                            <p style={{ color: 'gray', fontSize: '16px', marginBottom: '30px' }}>Fecha de vencimiento: <strong>{expirationDate}</strong></p>
                        </div> }

                    {loading && <div className="modal-body-container">
                        <p>Cargando{dots}</p>
                        </div> }
                </div>
                <div className="modal-footer-container">
                    <button onClick={closeModal} disabled={loading}>Cancelar</button>
                    <button type="button" onClick={downloadDocument} disabled={loading}>Descargar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalViewDocumentShip3;