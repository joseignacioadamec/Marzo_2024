// Función para manejar el clic en un usuario, muestra el modal de edición
export const handleUserClick = (
  user,
  setSelectedUser,
  setShowModal,
  setShowCreateModal
) => {
  setSelectedUser(user);
  setShowModal(true);
  setShowCreateModal(false);
};

// Cierra el modal de detalles o edición
export const closeModal = (setSelectedUser, setShowModal, setEditMode) => {
  setSelectedUser(null);
  setShowModal(false);
  setEditMode(null);
};

// Función para iniciar la edición de un campo de usuario
export const handleEdit = (
  field,
  user,
  setEditMode,
  setSelectedUser,
  setEditedValue
) => {
  if (field !== "company" && field !== "address") {
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
export const handleInputChange = (event, setEditedValue) => {
  setEditedValue(event.target.value);
};

// Función para guardar los cambios editados
export const handleSave = (
  users,
  setUsers,
  selectedUser,
  editMode,
  setEditMode,
  editedValue,
  setShowModal
) => {
  const updatedUsers = users.map((user) => {
    if (user.id === selectedUser.id) {
      if (editMode !== "company") {
        return { ...user, [editMode]: editedValue };
      } else {
        return { ...user, company: { ...user.company, name: editedValue } };
      }
    }
    return user;
  });
  // Actualiza el estado de los usuarios con los cambios editados
  setUsers(updatedUsers);
  setEditMode(null);
  setShowModal(false);
};
