"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, Edit, Trash, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { deleteCar, getCar, updateCar } from "@/lib/actions/Car.actions";
import { ICar } from "@/types/car";

export default function CarDetailPage() {
  const [car, setCar] = useState<ICar | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id && typeof id === 'string') {
      try {
        const fetchCarDetails = async () => {
          const data = await getCar(id);
          setCar(data.car);
        };
        fetchCarDetails();
      } catch (error) {
        console.log("Error fetching car details:", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Validate `id` and `car` before proceeding
      if (!id || !car) {
        throw new Error("Invalid car data or ID.");
      }

      // Send the updated car data to your backend
      const res = await updateCar(id as string, car);

      // Check if the response is successful before proceeding
      if (res?.status === 200) {
        setIsEditing(false);
        toast({
          title: "Car Updated",
          description: "The car details have been successfully updated.",
        });
      } else {
        throw new Error("Failed to update car.");
      }
    } catch (error) {
      console.error("Failed to save car:", error);
      toast({
        title: "Error",
        description: "Failed to update car. Please try again.",
        variant:"destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      // Validate `id` before attempting to delete
      if (!id) {
        throw new Error("Invalid car ID.");
      }

      // Send a delete request to your backend
      const res = await deleteCar(id as string);

      // Check if the response is successful before proceeding
      if (res?.status === 200) {
        toast({
          title: "Car Deleted",
          description:
            "The car has been successfully removed from your collection.",
          variant: "destructive",
        });
        router.push("/"); // Redirect to car listing page after successful deletion
      } else {
        throw new Error("Failed to delete car.");
      }
    } catch (error) {
      console.error("Failed to delete car:", error);
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      });
    }
  };
  type PartialCar = Partial<ICar>;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCar((prevCar) => ({
      ...(prevCar as ICar), 
      [name]: value,
    }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setCar((prevCar) => ({
      ...(prevCar as ICar),
      tags,
    }));
  };
  

  const nextImage = () => {
    if(car)setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const prevImage = () => {
    if(car)setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="w-full bg-white shadow-md">
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <Car className="mr-2" /> Car Details
          </h1>
        </div>
      </header>
      {car && (
        <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold flex items-center">
                  {isEditing ? (
                    <Input
                      name="title"
                      value={car.title}
                      onChange={handleInputChange}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    car.title
                  )}
                </CardTitle>
                <div className="space-x-2">
                  {!isEditing && (
                    <Button onClick={handleEdit} variant="outline">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this car?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the car from your collection.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={car.images[currentImageIndex]}
                  alt={`${car.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="tags">Description</Label>
              <CardDescription>
                {isEditing ? (
                  <Textarea
                    name="description"
                    value={car.description}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                ) : (
                  car.description
                )}
              </CardDescription>
                <Label htmlFor="tags">Tags</Label>
                {isEditing ? (
                  <Input
                    id="tags"
                    name="tags"
                    value={car.tags.join(", ")}
                    onChange={handleTagsChange}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {car.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditing && (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              )}
            </CardFooter>
          </Card>
        </main>
      )}
    </div>
  );
}
