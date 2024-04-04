import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { closeModal, handleInputChange } from '../utils/modalEdition';

export const UserEditModal = ({
  showModal,
  selectedUser,
  editMode,
  editedValue,
  setSelectedUser,
  setShowModal,
  setEditMode,
  setEditedValue,
  handleSave,
  users,
  setUsers
}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => closeModal(setSelectedUser, setShowModal, setEditMode)}
    >
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <div>
            <h4>{selectedUser.name}</h4>
            <img src={selectedUser.avatar} alt="Avatar" />
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editMode === "name" ? editedValue : selectedUser.name}
                onChange={(e) => handleInputChange(e, setEditedValue)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={
                    editMode === "email" ? editedValue : selectedUser.email
                  }
                  onChange={(e) => handleInputChange(e, setEditedValue)}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editMode === "phone" ? editedValue : selectedUser.phone
                  }
                  onChange={(e) => handleInputChange(e, setEditedValue)}
                />
              </Form.Group>
              <Form.Group controlId="formWebsite">
                <Form.Label>WebSite: </Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editMode === "website" ? editedValue : selectedUser.website
                  }
                  onChange={(e) => handleInputChange(e, setEditedValue)}
                />
              </Form.Group>
              <Form.Group controlId="formCompanyName">
                <Form.Label>Company Name: </Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editMode === "company"
                      ? editedValue
                      : selectedUser?.company?.name
                  }
                  onChange={(e) => handleInputChange(e, setEditedValue)}
                />
              </Form.Group>
            {/* Agrega los demás campos del formulario aquí */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => closeModal(setSelectedUser, setShowModal, setEditMode)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            handleSave(
              users,
              setUsers,
              selectedUser,
              editMode,
              setEditMode,
              editedValue,
              setShowModal
            )
          }
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
