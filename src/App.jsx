import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Modal, Form } from "react-bootstrap";
import gravatar from "gravatar";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserWebsite, setNewUserWebsite] = useState("");
  const [newUserBirthday, setNewUserBirthday] = useState("");
  const [error, setError] = useState("");

  console.log(users);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const updatedUsers = response.data.map((user) => ({
          ...user,
          birthday: generateRandomDate(),
          avatar: gravatar.url(user.email, { s: "200", d: "retro" }),
        }));
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
    // Limpiar campos al abrir/cerrar el modal
    if (!showCreateModal) {
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPhone("");
      setNewUserWebsite("");
      setNewUserBirthday("");
      setError("");
    }
  };

  const handleCreateUser = () => {
    // Validar campos
    if (!newUserName || !newUserEmail) {
      setError("El nombre y el correo electrónico son obligatorios.");
      return;
    }
  
    if (users.some(user => user.name === newUserName)) {
      setError("El nombre de usuario ya existe.");
      return;
    }
  
    if (newUserBirthday) {
      const birthdayDate = new Date(newUserBirthday);
      if (birthdayDate > new Date() || birthdayDate < new Date(1920, 0, 1)) {
        setError("La fecha de cumpleaños debe estar entre 1920 y la fecha actual.");
        return;
      }
    }
  
    // Crear nuevo usuario con un ID único
    const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = {
      id: newUserId,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      website: newUserWebsite,
      birthday: newUserBirthday || "",
      avatar: gravatar.url(newUserEmail, { s: "200", d: "retro" }),
    };
  
    // Actualizar estado de usuarios utilizando la función de actualización del estado
    setUsers(prevUsers => [...prevUsers, newUser]);
    // Cerrar modal
    toggleCreateModal();
  };

  const generateRandomDate = () => {
    const start = new Date(1920, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();
  }

  const handleSort = (field) => {
    if (sortedField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortedField] > b[sortedField] ? 1 : -1;
    } else {
      return a[sortedField] < b[sortedField] ? 1 : -1;
    }
  });


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = sortedUsers.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm.toLowerCase()) ||
      user.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${user.address.street}, ${user.address.suite}, ${user.address.city}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.birthday.includes(searchTerm.toLowerCase())
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setEditMode(null); 
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (field, user) => {
    setEditMode(field);
    setSelectedUser(user);
    setEditedValue(user[field]);
  };

  const handleInputChange = (event) => {
    setEditedValue(event.target.value); 
  };

  const handleSave = () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, [editMode]: editedValue };
      }
      return user;
    });
    setUsers(updatedUsers);
    setEditMode(null);
    setShowModal(false);
  };

 
  

  return (
    <div className="App">
            <div className="search-bar">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Button variant="link" onClick={() => handleSort("name")}>
                Name{" "}
                {sortedField === "name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </th>
            <th>
              <Button variant="link" onClick={() => handleSort("email")}>
                Email{" "}
                {sortedField === "email" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </th>
            <th>
              <Button variant="link" onClick={() => handleSort("phone")}>
                Phone{" "}
                {sortedField === "phone" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </Button>
            </th>
            <th>Website</th>
            <th>Company Name</th>
            <th>Address</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} onClick={() => handleUserClick(user)}>
              <td>
                {editMode === "name" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("name", user)}>
                    {user.name}
                  </span>
                )}
              </td>
              <td>
                {editMode === "email" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("email", user)}>
                    {user.email}
                  </span>
                )}
              </td>
              <td>
                {editMode === "phone" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("phone", user)}>
                    {user.phone}
                  </span>
                )}
              </td>
              <td>
                {editMode === "website" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("website", user)}>
                    {user.website}
                  </span>
                )}
              </td>

              <td>
                {editMode === "company" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("company", user)}>
                    {user.company && user.company.name}
                  </span>
                )}
              </td>

              <td>
                {editMode === "address" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span
                    onClick={() => handleEdit("address", user)}
                >{`${user?.address?.street}, ${user?.address?.suite} - ${user?.address?.zipcode} (${user?.address?.city})`}</span>
                )}
              </td>

              <td>
                {editMode === "birthday" &&
                selectedUser &&
                selectedUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span onClick={() => handleEdit("birthday", user)}>
                    {user.birthday}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from(
          { length: Math.ceil(users.length / usersPerPage) },
          (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      <Modal show={showModal} onHide={closeModal}>
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
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={
                    editMode === "email" ? editedValue : selectedUser.email
                  }
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editMode === "phone" ? editedValue : selectedUser.phone
                  }
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formWebsite">
                <Form.Label>WebSite: </Form.Label>
                <Form.Control
                  type="text"
                  value={
                    editMode === "website" ? editedValue : selectedUser.website
                  }
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formCompanyName">
                <Form.Label>Company Name: </Form.Label>
                <Form.Control
                  type="text"
                  value={editedValue}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
         {/* Botón para abrir modal de creación de usuario */}
         <Button variant="primary" onClick={toggleCreateModal}>Crear Nuevo Usuario</Button>

{/* Modal de creación de usuario */}
<Modal show={showCreateModal} onHide={toggleCreateModal}>
  <Modal.Header closeButton>
    <Modal.Title>Crear Nuevo Usuario</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Formulario para crear nuevo usuario */}
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formPhone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control type="text" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formWebsite">
        <Form.Label>Sitio Web</Form.Label>
        <Form.Control type="text" value={newUserWebsite} onChange={(e) => setNewUserWebsite(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formBirthday">
        <Form.Label>Fecha de Cumpleaños</Form.Label>
        <Form.Control type="date" value={newUserBirthday} onChange={(e) => setNewUserBirthday(e.target.value)} />
      </Form.Group>
    </Form> {/* Aquí debe cerrarse la etiqueta Form */}
    {/* Mostrar mensaje de error */}
    {error && <p className="text-danger">{error}</p>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={toggleCreateModal}>Cancelar</Button>
    <Button variant="primary" onClick={handleCreateUser}>Crear Usuario</Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}

export default App;
