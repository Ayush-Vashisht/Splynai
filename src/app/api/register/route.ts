import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
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

    return NextResponse.json({
      status: 200,
      newUser,
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
