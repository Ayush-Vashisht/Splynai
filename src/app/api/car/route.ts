import Cars from "@/lib/database/models/Cars.models";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError, isTokenValid, verifyToken } from "@/lib/utils";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await isTokenValid(req);
    if(!token)throw new Error(`Invalid token`);

    const { car, userId } = await req.json();

    const images = Array.isArray(car.images) ? car.images : [car.images];

    const newCar = await Cars.create({
      title: car.title,
      description: car.description,
      company: car.company,
      images: images,
      carType: car.carType,
      dealer: car.dealer,
      tags: car.tags,
      user: userId,
    });

    return NextResponse.json({ status: 200, newCar });
  } catch (error) {
    handleError(error);
    return NextResponse.json({
      status: 500,
      message: "Error creating car",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await isTokenValid(req);
    if(!token)throw new Error(`Invalid token`);
    const userId = req.nextUrl.searchParams.get("userId");
    const id = req.nextUrl.searchParams.get("id");
    const car = await Cars.findOne({ _id: id });
    if (!car) throw new Error("Could not find car with id " + id);

    return NextResponse.json({ status: 200, car });
  } catch (error) {
    handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await isTokenValid(req);
    if(!token)throw new Error(`Invalid token`);
    const { id, car } = await req.json();
    const updatedCar = await Cars.findOneAndUpdate({ _id: id }, car, {
      new: true,
    });
    if (!updatedCar) throw new Error("Update failed ");
    return NextResponse.json({ status: 200, updatedCar });
  } catch (error) {
    handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await isTokenValid(req);
    if(!token)throw new Error(`Invalid token`);
    const id = req.nextUrl.searchParams.get("id");
    console.log(id);
    const deleteCar = await Cars.findOneAndDelete({ _id: id });
    console.log(deleteCar);
    if (!deleteCar) throw new Error("Delete Car Failed");
    return NextResponse.json({
      status: 200,
      message: "Car deleted successfully",
    });
  } catch (error) {
    handleError(error);
  }
}
