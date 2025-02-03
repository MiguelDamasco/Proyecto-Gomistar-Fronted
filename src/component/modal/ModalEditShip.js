import { useState, useEffect } from 'react';
import axios from 'axios';


const ModalEditShip = ({ closeModal, shipToEdit, editShip, setFormMessage }) => {
    const [type, setType] = useState('');
    const [originalType, setOriginalType] = useState('');
    const [selectedLoadType, setSelectedLoadType] = useState('');
    const [message, setMessage] = useState('');
    const [loadTypes, setLoadTypes] = useState([]);
    const [shipName, setShipName] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Obtener tipos de carga desde la API
        const fetchLoadType = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8115/loadType/listAll",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setLoadTypes(response.data.value || []);
            } catch (error) {
                console.error('Error al obtener los tipos de carga:', error);
            }
        };

        fetchLoadType();
    }, [token]);

    useEffect(() => {
        // Inicializar datos del barco
        setType(shipToEdit.typeShip === "Pasajeros" ? "Passenger" : "Cargo");
        setOriginalType(shipToEdit.typeShip === "Pasajeros" ? "Passenger" : "Cargo");
        setShipName(shipToEdit.name);
    }, [shipToEdit]);

    useEffect(() => {
        
        if (loadTypes.length > 0 && type === "Cargo") {
            const result = shipToEdit.typeShip.split(" ");
            if (result[1]) {
                const finalResult = result[1].slice(1, -1);
                const matchingLoadType = loadTypes.find(
                    (load) => load.name === finalResult || load.id === finalResult
                );
                if (matchingLoadType) {
                    setSelectedLoadType(matchingLoadType.id);
                }
            }
        }
    }, [loadTypes, shipToEdit, type]);

    const handleLoadTypeChange = (e) => {
        setSelectedLoadType(e.target.value);
    };

    const handleEditShip = async () => {
        ;
        try {
            if (type === "Passenger") {
                if(originalType === "Passenger") {
                await axios.put(
                    "http://localhost:8115/Passenger_ship/edit",
                    { id: shipToEdit.id, name: shipName, transform: "0" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            else if(originalType === "Cargo") {
                await axios.put(
                    "http://localhost:8115/cargoShip/cargo_to_passenger",
                    { id: shipToEdit.id, name: shipName, transform: "1" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            } else if (type === "Cargo") {
                console.log("id Load: " + selectedLoadType);
                if(originalType === "Cargo"){
                    await axios.put(
                        "http://localhost:8115/cargoShip/edit",
                        {
                            id: shipToEdit.id,
                            name: shipName,
                            idLoad: selectedLoadType,
                            trnasform: "0"
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
                else if(originalType === "Passenger") {
                    await axios.put(
                        "http://localhost:8115/Passenger_ship/passenger_to_cargo",
                        {
                            id: shipToEdit.id,
                            name: shipName,
                            idLoad: selectedLoadType,
                            trnasform: "1"
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
            }
            setFormMessage("barco modificado con exito!");
            editShip({ id: shipToEdit.id, name: shipName, type, loadType: selectedLoadType });
            closeModal();
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            setMessage("Seleccione un tipo de carga!");
        }
    };

    return (
        <div className="modal-background-container">
            <div className="modal-main-container">
                
                <div className="modal-title-container">
                    <h1>Editar barco</h1>
                </div>
                
                <div className="modal-body-container">
                <div className="modal-close-button">
                    <button onClick={closeModal}>X</button>
                </div>
                    <div className="modal-name-container">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={shipName}
                            onChange={(e) => setShipName(e.target.value)}
                        />
                    </div>
                    <div className="modal-type-container">
                        <label>Tipo:</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Cargo">Carga</option>
                            <option value="Passenger">Pasajeros</option>
                        </select>
                    </div>
                    {type === "Cargo" && (
                        <div className="modal-load-container">
                            <label>Carga:</label>
                            <select
                                onChange={handleLoadTypeChange}
                                value={selectedLoadType}
                            >
                                <option value="" disabled>
                                    Seleccione una opción
                                </option>
                                {loadTypes.map((load) => (
                                    <option key={load.id} value={load.id}>
                                        {load.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="modal-message-container">
                        <p>{message}</p>
                    </div>
                </div>
                <div className="modal-footer-container">
                    <button onClick={closeModal}>Cancelar</button>
                    <button
                        onClick={handleEditShip}
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

export default ModalEditShip;
