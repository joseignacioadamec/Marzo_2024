import axios from "axios";
import { generateRandomDate } from "../utils/generateRandomDate";
import gravatar from "gravatar";

export const getData = (setUsers) => {
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
}