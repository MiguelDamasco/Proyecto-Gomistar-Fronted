import React, { useEffect, useState } from "react";
import axios from "axios";

const CargoShips = () => {
  const [ships, setShips] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchShips = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("JWT no encontrado");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8115/cargoShip/listAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShips(response.data.value);
      } catch (error) {
        console.error("Error al obtener los barcos:", error);
      }
    };

    fetchShips();
  }, []);

  const handleShowUsers = (userList) => {
    setSelectedUsers(userList);
  };

  return (
    <div>
      <h1>Lista de Barcos de Carga</h1>
      <ul>
        {ships.map((ship) => (
          <li key={ship.id}>
            <h2>{ship.name}</h2>
            <button onClick={() => handleShowUsers(ship.userList)}>
              Listar Usuarios
            </button>
          </li>
        ))}
      </ul>

      <div>
        <h2>Usuarios del Barco Seleccionado</h2>
        {selectedUsers.length > 0 ? (
          <ul>
            {selectedUsers.map((user) => (
              <li key={user.id}>
                <p>Correo: {user.email}</p>
                <p>Nombre de Usuario: {user.username}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios seleccionados.</p>
        )}
      </div>
    </div>
  );
};

export default CargoShips;

