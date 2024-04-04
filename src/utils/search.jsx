import { sortedUsers } from "./sort";

// Filtra los usuarios según el término de búsqueda y paginación
export const filteredUsers = (
  users,
  sortDirection,
  sortedField,
  searchTerm
) => {
  return sortedUsers(users, sortDirection, sortedField).filter((user) => {
    return (
      // Filtra por nombre, correo electrónico, teléfono, sitio web, nombre de la empresa, dirección y fecha
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm.toLowerCase()) ||
      user.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company &&
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${user.address.street}, ${user.address.suite}, ${user.address.city}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.birthday && user.birthday.includes(searchTerm.toLowerCase()))
    );
  });
};

// Función para manejar el cambio en el término de búsqueda
export const handleSearch = (event, setSearchTerm, setCurrentPage) => {
  setSearchTerm(event.target.value);
  setCurrentPage(1);
};
