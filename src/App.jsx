import React, { useState, useEffect } from "react";
import { Pagination, Button, Form } from "react-bootstrap";
import { getData } from "./helpers/getData";
import { handleEdit, handleSave} from "./utils/modalEdition";
import { filteredUsers, handleSearch } from "./utils/search";
import { toggleCreateModal } from "./utils/createNewUser";
import { UserEditModal } from "./components/UserEditModal";
import { CreateUserModal } from "./components/CreateUserModal";
import { UserTable } from "./components/UsersTable";

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
    getData(setUsers);
  }, []);

  console.log(users);
  console.log(selectedUser, "selectedUser");

  // Calcula los índices del primer y último usuario a mostrar en la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Obtiene los usuarios a mostrar en la página actual
  const currentUsers = filteredUsers(
    users,
    sortDirection,
    sortedField,
    searchTerm
  ).slice(indexOfFirstUser, indexOfLastUser);

  // Cambia a la página seleccionada en la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <div className="search-bar">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e, setSearchTerm, setCurrentPage)}
        />
      </div>
      <UserTable
        currentUsers={currentUsers}
        sortedField={sortedField}
        setSortedField={setSortedField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        handleEdit={handleEdit}
        setSelectedUser={setSelectedUser}
        setEditMode={setEditMode}
        setEditedValue={setEditedValue}
        editMode={editMode}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        editedValue={editedValue}
      />
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
      {/* Modal para editar de usuarios */}
      <UserEditModal
        showModal={showModal}
        selectedUser={selectedUser}
        editMode={editMode}
        editedValue={editedValue}
        setSelectedUser={setSelectedUser}
        setShowModal={setShowModal}
        setEditMode={setEditMode}
        setEditedValue={setEditedValue}
        handleSave={handleSave}
        users={users}
        setUsers={setUsers}
      />
      {/* Botón para abrir modal de creación de usuario */}
      <Button
        variant="primary"
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
        Crear Nuevo Usuario
      </Button>
      {/* Modal de creación de usuario */}
      <CreateUserModal
        showCreateModal={showCreateModal}
        newUserName={newUserName}
        newUserEmail={newUserEmail}
        newUserPhone={newUserPhone}
        newUserWebsite={newUserWebsite}
        newUserBirthday={newUserBirthday}
        error={error}
        setShowCreateModal={setShowCreateModal}
        setNewUserName={setNewUserName}
        setNewUserEmail={setNewUserEmail}
        setNewUserPhone={setNewUserPhone}
        setNewUserWebsite={setNewUserWebsite}
        setNewUserBirthday={setNewUserBirthday}
        setError={setError}
        users={users}
        setUsers={setUsers}
      />
    </div>
  );
}

export default App;
