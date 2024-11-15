import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secretKey = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

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
