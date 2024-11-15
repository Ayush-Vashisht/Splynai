'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Car } from 'lucide-react'
import { addCar } from '@/lib/actions/Car.actions'

export default function AddCarPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [carType, setCarType] = useState('')
  const [company, setCompany] = useState('')
  const [dealer, setDealer] = useState('')
  const [additionalTags, setAdditionalTags] = useState('')
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then(results => {
      setImages(prevImages => [...prevImages, ...results].slice(0, 10))
    })
  }

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newCar = {
      title,
      description,
      tags: [carType, company, dealer, ...additionalTags.split(',').map(tag => tag.trim())].filter(Boolean),
      images,
      dealer,
      carType,
      company
    }
    const res = await addCar(newCar);
    console.log('New car data:', res)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 ">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Car size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">Add New Car</CardTitle>
          <CardDescription>Fill in the details to add a new car to your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 ">
              <Label htmlFor="title" className='font-semibold'>Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="Enter car title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className='font-semibold'>Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                placeholder="Describe the car"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carType" className='font-semibold'>Car Type</Label>
                <Input 
                  id="carType" 
                  value={carType} 
                  onChange={(e) => setCarType(e.target.value)} 
                  placeholder="e.g. Sedan, SUV" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className='font-semibold'>Company</Label>
                <Input 
                  id="company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="e.g. Toyota, Ford" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealer" className='font-semibold'>Dealer</Label>
                <Input 
                  id="dealer" 
                  value={dealer} 
                  onChange={(e) => setDealer(e.target.value)} 
                  placeholder="e.g. Certified, New" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalTags" className='font-semibold'>Additional Tags</Label>
              <Input 
                id="additionalTags" 
                value={additionalTags} 
                onChange={(e) => setAdditionalTags(e.target.value)} 
                placeholder="Enter additional tags, separated by commas" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images" className='font-semibold'>Images (up to 10)</Label>
              <Input 
                id="images" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
                className="mb-2" 
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Add Car
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {[carType, company, dealer, ...additionalTags.split(',')].filter(Boolean).map((tag, index) => (
              <Badge key={index} variant="secondary">{tag.trim()}</Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}