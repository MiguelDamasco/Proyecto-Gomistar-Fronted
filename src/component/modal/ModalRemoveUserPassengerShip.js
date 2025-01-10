import React from "react";

const ModalRemoveUserPassengerShip = ({closeModal, userToRemove, removeUser}) => {

    return (

        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Remover tripulante</h1>
                </div>
                <div className="body-container">
                    <p>Estas seguro que queieres remover el tripulante <strong>{userToRemove.name}</strong>?</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={removeUser} id="delete-btn" type="button">Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalRemoveUserPassengerShip;