  // Función para generar una fecha de cumpleaños aleatoria
export const generateRandomDate = () => {
    const start = new Date(1920, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();
  };