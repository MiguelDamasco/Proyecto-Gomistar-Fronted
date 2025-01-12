import React, { useState, useEffect } from "react";
import axios from 'axios';

const ModalRemoveDocumentShip1 = ({closeModal, removeDocument}) => {

    return (

        <div className="background-container">
            <div className="main-container">
                <div className="close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                <div className="title-container">
                    <h1>Remover documento</h1>
                </div>
                <div className="body-container">
                    <p>Estas seguro que quieres eliminar el documento <strong>registro de embarcaciones</strong>?</p>
                </div>
                <div className="footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button onClick={removeDocument} id="delete-btn" type="button">Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalRemoveDocumentShip1;