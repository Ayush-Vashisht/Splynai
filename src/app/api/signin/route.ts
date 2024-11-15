import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";

// Secret key for JWT (ensure this is set in .env)
const secretKey = process.env.JWT_SECRET || "your-secret-key";

// Function to generate JWT token
const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};

// Define the handler with custom properties
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    // Generate the token
    const token = generateToken(user._id.toString());

    // Respond with success and token
    return NextResponse.json({
      status: 200,
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
