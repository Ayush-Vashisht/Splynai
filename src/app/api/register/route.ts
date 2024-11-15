import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { fullname, email, password } = await req.json();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({
        status: 400,
        message: "Email already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Secret key for JWT (ensure this is set in .env)
    const secretKey = process.env.JWT_SECRET || "your-secret-key";

    // Function to generate JWT token
    const generateToken = (userId: string): string => {
      const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
      return token;
    };

    const token = generateToken(newUser._id.toString());

    return NextResponse.json({
      status: 200,
      newUser,
      token,
      userId:newUser._id,
      message: "User registered successfully",
    });
  } catch (error) {
    handleError(error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
