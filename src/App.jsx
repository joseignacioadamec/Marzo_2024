import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Modal, Form } from "react-bootstrap";
import gravatar from "gravatar";
import axios from "axios";

function App() {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);
  // Estado para el número de página actual en la paginación
  const [currentPage, setCurrentPage] = useState(1);
  // Estado para el número de usuarios por página
  const [usersPerPage] = useState(6);
  // Estado para el campo por el cual se está ordenando
  const [sortedField, setSortedField] = useState(null);
  // Estado para la dirección de ordenamiento
  const [sortDirection, setSortDirection] = useState("asc");
  // Estado para almacenar el usuario seleccionado para mostrar detalles o editar
  const [selectedUser, setSelectedUser] = useState(null);
  // Estado para controlar la visibilidad del modal de detalles o edición
  const [showModal, setShowModal] = useState(false);
  // Estado para controlar si estamos en modo de edición y qué campo se está editando
  const [editMode, setEditMode] = useState(null);
  // Estado para almacenar el valor editado
  const [editedValue, setEditedValue] = useState("");
  // Estado para el término de búsqueda en la tabla de usuarios
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para controlar la visibilidad del modal de creación de usuario
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Estado para almacenar los datos del nuevo usuario a crear
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserWebsite, setNewUserWebsite] = useState("");
  const [newUserBirthday, setNewUserBirthday] = useState("");
  // Estado para el mensaje de error
  const [error, setError] = useState("");

  // Se ejecuta al montar el componente, obtiene los usuarios del servicio web
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        // Modifica los usuarios para agregar un campo de fecha de cumpleaños aleatorio y un avatar
        const updatedUsers = response.data.map((user) => ({
          ...user,
          birthday: generateRandomDate(),
          avatar: gravatar.url(user.email, { s: "200", d: "retro" }),
        }));
        // Actualiza el estado de los usuarios
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  console.log(users);

  // Función para generar una fecha de cumpleaños aleatoria
  const generateRandomDate = () => {
    const start = new Date(1920, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();
  };

  // Función para cambiar el campo por el cual se ordena la tabla
  const handleSort = (field) => {
    if (sortedField === field) {
      // Si ya se está ordenando por el mismo campo, cambia la dirección de ordenamiento
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si se está ordenando por un nuevo campo, establece el campo y la dirección de ordenamiento predeterminada
      setSortedField(field);
      setSortDirection("asc");
    }
  };

  // Ordena los usuarios según el campo y la dirección de ordenamiento
  const sortedUsers = [...users].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortedField] > b[sortedField] ? 1 : -1;
    } else {
      return a[sortedField] < b[sortedField] ? 1 : -1;
    }
  });

  // Calcula los índices del primer y último usuario a mostrar en la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Filtra los usuarios según el término de búsqueda y paginación
  const filteredUsers = sortedUsers.filter((user) => {
    return (
      // Filtra por nombre, correo electrónico, teléfono, sitio web, nombre de la empresa, dirección y fecha de cumpleaños
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm.toLowerCase()) ||
      user.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company &&
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${user.address.street}, ${user.address.suite}, ${user.address.city}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.birthday.includes(searchTerm.toLowerCase())
    );
  });

  // Obtiene los usuarios a mostrar en la página actual
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambia a la página seleccionada en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar el clic en un usuario, muestra el modal de detalles o edición
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Cierra el modal de detalles o edición
  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setEditMode(null);
  };

  // Función para manejar el cambio en el término de búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Función para iniciar la edición de un campo de usuario
  const handleEdit = (field, user) => {
    if (field !== "company" && field !== "address") {
      console.log(user, "+++++++++++++++++");
      setEditMode(field);
      setSelectedUser(user);
      setEditedValue(user[field]);
    } else if (field === "company") {
      setEditMode(field);
      setSelectedUser(user);
      setEditedValue(user.company.name);
    }
  };

  // Función para manejar el cambio en el valor editado
  const handleInputChange = (event) => {
    setEditedValue(event.target.value);
  };

  // Función para guardar los cambios editados
  const handleSave = () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        if(editMode !== "company") {
          return { ...user, [editMode]: editedValue };
        } else {
          return { ...user, company: {...user.company, name: editedValue } };
        }
  
      }
      return user;
    });
    // Actualiza el estado de los usuarios con los cambios editados
    setUsers(updatedUsers);
    setEditMode(null);
    setShowModal(false);
  };

  // Función para crear un nuevo usuario
  const handleCreateUser = () => {
    // Validación de campos
    if (!newUserName || !newUserEmail) {
      setError("El nombre y el correo electrónico son obligatorios.");
      return;
    }

    if (users.some((user) => user.name === newUserName)) {
      setError("El nombre de usuario ya existe.");
      return;
    }

    if (newUserBirthday) {
      const birthdayDate = new Date(newUserBirthday);
      if (birthdayDate > new Date() || birthdayDate < new Date(1920, 0, 1)) {
        setError(
          "La fecha de cumpleaños debe estar entre 1920 y la fecha actual."
        );
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

    // Actualizar estado de usuarios
    setUsers((prevUsers) => [...prevUsers, newUser]);
    // Cerrar modal
    toggleCreateModal();
  };

  // Función para abrir o cerrar el modal de creación de usuario
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
                    {user?.company && user?.company?.name}
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
                  value={
                    editMode === "company"
                      ? editedValue
                      : selectedUser.company.name
                  }
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
      <Button variant="primary" onClick={toggleCreateModal}>
        Crear Nuevo Usuario
      </Button>

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
          <Button variant="secondary" onClick={toggleCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Crear Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
