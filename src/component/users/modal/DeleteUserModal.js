import React, { useState, useEffect } from "react";
import axios from 'axios';

const DeleteUserModal = ({closeModal, token, userToDelete, deleteMessage}) => {

    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');

     useEffect(() => {
                    const interval = setInterval(() => {
                        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
                    }, 400); // Cambia cada 500ms
                
                    return () => clearInterval(interval); // Limpia el intervalo al desmontar
                }, []);
    
    const deleteUser = async () => {
        if (!userToDelete || !token) {
            console.error('Faltan valores requeridos (userToDelete o token)');
            return;
        }

        setLoading(true);
    
        try {
    
            const response = await axios.delete(
                "http://localhost:8115/user/delete",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { pIdUser: userToDelete.id },
                }
            );
    
            if (response.status === 200) {
                deleteMessage(response.data.message);
            } else {
                console.error("No se pudo eliminar el Usuario.");
            }
        } catch (error) {
            console.error('Error al intentar eliminar el Usuario:', error);
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
                    <h1>Remover Usuario</h1>
                </div>
                <div className="body-container">
                    {!loading && <p>Estas seguro que quieres eliminar el usuario <strong>{userToDelete.username}</strong>?</p> }
                    {loading && <p>Eliminado{dots}</p>}
                </div>
                <div className="footer-container">
                    <button onClick={closeModal} disabled={loading}>Cancelar</button>
                    <button onClick={deleteUser} id="delete-btn" type="button" disabled={loading}>Eliminar</button>
                </div>
            </div>
        </div>
    );
} 

export default DeleteUserModal;