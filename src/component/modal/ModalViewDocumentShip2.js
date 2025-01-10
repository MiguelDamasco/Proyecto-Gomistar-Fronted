import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalViewDocumentShip2 = ({ closeModal, idShip, token }) => {

    const [expirationDate, setExpirationDate] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get('http://localhost:8115/certificate_navigability/get_document', {
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
            }
        };

        fetchDocument();
    }, [idShip, token]);


    const downloadDocument = async () => {
        try {
            // Solicitar al backend para obtener la URL prefirmada
            const response = await axios.get('http://localhost:8115/certificate_navigability/download_image', {
                params: { pIdShip: idShip },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Obtener la URL prefirmada de la respuesta
            const presignedUrl = response.data.value;
            console.log("URL de descarga: ", presignedUrl);
            
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
        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Mi Documento</h1>
                </div>
                <div className="body-container">
                    <img src={image} alt="Documento" style={{ maxWidth: '100%' }}></img>
                    <p>Fecha de vencimiento: {expirationDate}</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button type="button" onClick={downloadDocument}>Descargar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalViewDocumentShip2;