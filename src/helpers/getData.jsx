import axios from "axios";
import { generateRandomDate } from "../utils/generateRandomDate";
import gravatar from "gravatar";

export const getData = async (setUsers) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
    const updatedUsers = response.data.map((user) => ({
      ...user,
      birthday: generateRandomDate(),
      avatar: gravatar.url(user.email, { s: "200", d: "retro" }),
    }));
    setUsers(updatedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};