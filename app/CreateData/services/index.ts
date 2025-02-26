import { User } from "../types";

// Fetch
export default async function servicesDummyjson() {
  try {
    const response = await fetch("https://dummyjson.com/users");
    const { users }: { users: User[] } = await response.json();

    return users;
  } catch (error) {
    console.log(error);
  }
}
