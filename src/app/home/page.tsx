"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Car, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { ICar } from "@/types/car";
import { getCars } from "@/lib/actions/Car.actions";

interface Car {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

// Image Carousel component
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full h-48">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Car image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Car card component
const CarCard = ({ car }: { car: Car }) => (
  <Link href={`/car/${car._id}`}>
    <Card className="cursor-pointer">
      <ImageCarousel images={car.images} />
      <CardHeader>
        <CardTitle>{car.title}</CardTitle>
        <CardDescription>
          {car.description.slice(0, 100) + "..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {car.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function CarManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState<ICar[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const carsPerPage = 6;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await getCars({
          searchTerm: searchTerm || "",
          page: currentPage,
          limit: carsPerPage,
        });
        const { cars, totalPages } = data;

        setFilteredCars(cars);
        setTotalPages(totalPages);
      } catch (error) {
        console.log("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, [searchTerm, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto">
      <header className="w-full bg-white shadow-md mt-2">
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <Car className="mr-2" /> My Cars
          </h1>
        </div>
      </header>
      <div className="flex gap-2 p-4">
        <Input
          type="search"
          placeholder="Search cars..."
          className="mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setSearchTerm(searchTerm)}>Search</Button>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.isArray(filteredCars) &&
          filteredCars.length > 0 &&
          filteredCars
            .filter((car): car is ICar & { _id: string } => !!car._id)
            .map((car) => <CarCard key={car._id} car={car} />)}
      </div>
      <Pagination className="mt-4 p-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              {currentPage !== 1 && (
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
