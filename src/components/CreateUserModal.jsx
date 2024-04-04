import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { handleCreateUser, toggleCreateModal } from "../utils/createNewUser";

export const CreateUserModal = ({
  showCreateModal,
  newUserName,
  newUserEmail,
  newUserPhone,
  newUserWebsite,
  newUserBirthday,
  error,
  setShowCreateModal,
  setNewUserName,
  setNewUserEmail,
  setNewUserPhone,
  setNewUserWebsite,
  setNewUserBirthday,
  setError,
     users,
setUsers

}) => {
  return (
    <Modal
    show={showCreateModal}
    onHide={() =>
      toggleCreateModal(
        setShowCreateModal,
        showCreateModal,
        setNewUserName,
        setNewUserEmail,
        setNewUserPhone,
        setNewUserWebsite,
        setNewUserBirthday,
        setError,
      )
    }
  >
    <Modal.Header closeButton>
      <Modal.Title>Crear Nuevo Usuario</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* Formulario para crear nuevo usuario */}
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={newUserPhone}
            onChange={(e) => setNewUserPhone(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formWebsite">
          <Form.Label>Sitio Web</Form.Label>
          <Form.Control
            type="text"
            value={newUserWebsite}
            onChange={(e) => setNewUserWebsite(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Fecha de Cumpleaños</Form.Label>
          <Form.Control
            type="date"
            value={newUserBirthday}
            onChange={(e) => setNewUserBirthday(e.target.value)}
          />
        </Form.Group>
      </Form>{" "}
      {/* Aquí debe cerrarse la etiqueta Form */}
      {/* Mostrar mensaje de error */}
      {error && <p className="text-danger">{error}</p>}
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={() =>
          toggleCreateModal(
            setShowCreateModal,
            showCreateModal,
            setNewUserName,
            setNewUserEmail,
            setNewUserPhone,
            setNewUserWebsite,
            setNewUserBirthday,
            setError
          )
        }
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          handleCreateUser(
            users,
            setUsers,
            newUserName,
            newUserEmail,
            setError,
            newUserBirthday,
            newUserPhone,
            newUserWebsite
          )
        }
      >
        Crear Usuario
      </Button>
    </Modal.Footer>
  </Modal>
  );
};
