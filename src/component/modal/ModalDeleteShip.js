import React from "react";

const ModalDeleteShip = ({closeModal, shipToDelete, deleteShip}) => {

    return (

        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Eliminar barco</h1>
                </div>
                <div className="body-container">
                    <p>Estas seguro que queieres eliminar el barco <strong>{shipToDelete.name}</strong>?</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={deleteShip} id="delete-btn" type="button">Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalDeleteShip;