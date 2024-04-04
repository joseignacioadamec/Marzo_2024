  // Función para cambiar el campo por el cual se ordena la tabla
  export const handleSort = (field, sortedField, setSortedField, sortDirection, setSortDirection) => {
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
  export const sortedUsers = (users, sortDirection, sortedField) => {
    return [...users].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortedField] > b[sortedField] ? 1 : -1;
      } else {
        return a[sortedField] < b[sortedField] ? 1 : -1;
      }
    });
  };
  