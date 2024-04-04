import gravatar from "gravatar";

// Función para crear un nuevo usuario
export const handleCreateUser = (
  users,
  setUsers,
  newUserName,
  newUserEmail,
  setError,
  newUserBirthday,
  newUserPhone,
  newUserWebsite,
) => {
  // Validación de campos
  if (!newUserName || !newUserEmail) {
    setError("El nombre y el correo electrónico son obligatorios.");
    return;
  }

  if (users?.some((user) => user?.name === newUserName)) {
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
  // Cerrar modal de creacion de nuevo usuario
  toggleCreateModal();
};

// Función para abrir o cerrar el modal de creación de usuario
export const toggleCreateModal = (
  setShowCreateModal,
  showCreateModal,
  setNewUserName,
  setNewUserEmail,
  setNewUserPhone,
  setNewUserWebsite,
  setNewUserBirthday,
  setError
) => {
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
