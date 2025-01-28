import { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEditAlert = ({ closeModal, alertToEdit, token }) => {
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [today, setToday] = useState('');

    // Inicializar datos de la alerta al montar el componente
    useEffect(() => {
        if (alertToEdit) {
            setDate(formatDate(alertToEdit.date)); // Convertir formato dd/MM/yyyy a yyyy-MM-dd
        }
        console.log("fecha a modificar: " + date);
        setToday(getTodayDate());
    }, [alertToEdit]);

    // Función para convertir fecha de formato dd/MM/yyyy a yyyy-MM-dd (formato ISO)
    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función para manejar el envío del formulario de edición
    const handleEditAlert = async () => {
        if (!date) {
            setMessage('La fecha es obligatoria.');
            return;
        }

        console.log("Alerta a modificar: " + alertToEdit);

        try {
            const response = await axios.put(
                "http://localhost:8115/alert/modify",
                {
                    id: alertToEdit.id,
                    date, // Se envía en formato yyyy-MM-dd
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message); // Mostrar mensaje del servidor
            closeModal(); // Cerrar modal después de guardar
        } catch (error) {
            console.error(error);
            setMessage('Error al modificar la alerta. Intente nuevamente.');
        }
    };

    return (
        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Editar Alerta</h1>
                </div>
                <div className="date-container">
                    <label htmlFor="alert-date">Fecha:</label>
                    <input
                        id="alert-date"
                        type="date"
                        min={today}
                        value={date} // Asignar el estado de `date` al input
                        onChange={(e) => setDate(e.target.value)} // Actualizar el estado al cambiar el valor
                    />
                </div>
                <div className="message-container">
                    <p>{message}</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button
                        onClick={handleEditAlert}
                        id="edit-btn"
                        type="button"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditAlert;
