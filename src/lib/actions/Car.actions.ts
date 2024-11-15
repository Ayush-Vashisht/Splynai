import axios from "axios";
import { handleError } from "../utils";
import { ICar } from "@/types/car";

export async function getCars({
  searchTerm,
  limit = 6,
  page = 1,
}: {
  searchTerm: string;
  limit: number;
  page: number;
}) {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID is missing.");
    }

    const { data } = await axios.get("/api/cars", {
      params: {
        userId: userId,
        searchTerm: searchTerm,
        limit: limit,
        page: page,
      },
      headers: {
        Authorization: "Bearer" + localStorage.getItem("token"),
      },
    });

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    handleError(error);
  }
}

export async function getCar(id: string) {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID is missing.");
    }

    const { data } = await axios.get("/api/car", {
      params: { userId: userId, id: id },
      headers: {
        Authorization: "Bearer" + localStorage.getItem("token"),
      },
    });

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    handleError(error);
  }
}

export async function updateCar(id: string, car: ICar) {
  try {
    const { data } = await axios.put(
      "/api/car",
      {
        id: id,
        car: car,
      },
      {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token"),
        },
      }
    );

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteCar(id: string) {
  try {
    const res = await axios.delete(`/api/car/`, {
      params: { id: id },
      headers: {
        Authorization: "Bearer" + localStorage.getItem("token"),
      },
    });

    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    handleError(error);
  }
}

export async function addCar(car: ICar) {
  try {
    console.log(car);
    const { data } = await axios.post(
      "/api/car",
      {
        car: car,
        userId: localStorage.getItem("userId"),
      },
      {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token"),
        },
      }
    );

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    handleError(error);
  }
}
