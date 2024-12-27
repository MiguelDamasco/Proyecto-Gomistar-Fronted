import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';

const ModalForm = ({ show, user, onHide, onSave }) => {
  // Si user es null, inicializa editedUser como un objeto vacío
  const [editedUser, setEditedUser] = useState(user || {});

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(editedUser);
  };

  // Si el user es null o undefined, no renderizamos el modal
  if (!user) return null;

  return (
    <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Usuario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedUser.email || ''}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={editedUser.username || ''}
              onChange={handleChange}
              placeholder="Username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedUser.name || ''}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={editedUser.lastname || ''}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Editar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;

