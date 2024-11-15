import { connectToDatabase } from "../database/mongoose";
import { IUser } from "@/types/user";
import axios from "axios";

export async function createUser(user: IUser) {
  try {
    await connectToDatabase();
    console.log(user);

    const { fullname, email, password } = user;
    const res = await axios.post("/api/register", {
      fullname: fullname,
      email: email,
      password: password,
    });
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function signin(email: string, password: string) {
  try {
    const { data } = await axios.post("/api/signin", {
      email: email,
      password: password,
    });
    console.log(data);
    const { userId } = data;
    const {token} = data;
    localStorage.setItem('tokne', token);
    localStorage.setItem("userId", userId);
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
