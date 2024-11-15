import { connectToDatabase } from "../database/mongoose";
import { IUser } from "@/types/user";
import axios from "axios";

export async function createUser(user: IUser) {
  try {
    await connectToDatabase();
    console.log(user);

    const { fullname, email, password } = user;
    const { data } = await axios.post("/api/register", {
      fullname: fullname,
      email: email,
      password: password,
    });
    if (data.status === 200) {
      console.log(data);
      const { userId } = data;
      const { token } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      return JSON.parse(JSON.stringify(data));
    } else throw new Error("Inavlid Email or Password");
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
    if (data.status === 200) {
      console.log(data);
      const { userId } = data;
      const { token } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      return JSON.parse(JSON.stringify(data));
    } else throw new Error("Inavlid Email or Password");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
