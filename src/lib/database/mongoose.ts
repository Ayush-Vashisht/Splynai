'use server'
import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;
  try {
    const MONGODB_URL = process.env.MONGODB_URL
    console.log(MONGODB_URL);
    if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");
    await mongoose.connect(MONGODB_URL);
    isConnected = true;
    console.log("Successfully connected to Database.");
  } catch (error) {
    console.log("Error connecting to database:", error);
    throw error;
  }
}
