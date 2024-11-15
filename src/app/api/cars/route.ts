import Cars from "@/lib/database/models/Cars.models";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError, isTokenValid } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await isTokenValid(req);
    if (!token) throw new Error(`Invalid token`);
    const userId = req.nextUrl.searchParams.get("userId");
    const searchTerm = req.nextUrl.searchParams.get("searchTerm") || "";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "6", 10);
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);

    if (!userId) {
      throw new Error("User ID is missing.");
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;
    const searchQuery: any = {
      user: userId,
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const cars = await Cars.find(searchQuery).skip(skip).limit(limit);
    const totalCount = await Cars.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      status: 200,
      data: {
        totalPages,
        totalCount,
        cars,
        page,
      },
    });
  } catch (error) {
    handleError(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
