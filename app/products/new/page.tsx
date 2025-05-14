"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"
import { addProduct } from "@/lib/firebase/firestore"
import { uploadFiles } from "@/lib/firebase/storage"

const categories = [
  {
    name: "Phone",
    subcategories: ["Feature Phone", "Smart Phone", "Smart Watch"],
  },
  {
    name: "Computer",
    subcategories: ["Laptop", "Desktop", "Monitor", "Mouse", "Keyboard", "Others"],
  },
  {
    name: "Vehicle",
    subcategories: ["Bicycle", "Motorbikes"],
  },
  {
    name: "Textbooks",
    subcategories: ["CSE", "EEE", "Textile", "Civil"],
  },
]

export default function NewProductPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [phone,setPhone]=useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      if (filesArray.length + images.length > 5) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        })
        return
      }

      setImages([...images, ...filesArray])

      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newImageUrls = [...imagePreviewUrls]
    URL.revokeObjectURL(newImageUrls[index])
    newImageUrls.splice(index, 1)
    setImagePreviewUrls(newImageUrls)
  }


  function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of your product",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Upload images to Firebase Storage
      const urls: string[] = [];

    for (const file of Array.from(images)) {
      const base64 = await fileToBase64(file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      if (data.url) urls.push(data.url);
    }

      // Create product in Firestore
      const productData = {
        title,
        description,
        price: Number(price),
        category: category.toLowerCase(),
        subcategory,
        images: urls,
        userId: user!.uid,
        userDisplayName: user!.displayName || "Unknown User",
        createdAt: new Date().toISOString(),
        status: "active",
        phone:phone
      }

      const productId = await addProduct(productData)

      toast({
        title: "Product listed successfully",
        description: "Your product has been listed on Handoff.io",
      })

      router.push(`/products/${productId}`)
    } catch (error) {
      console.error("Error listing product:", error)
      toast({
        title: "Error listing product",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Post Ad</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Product Details</CardTitle>
              <CardDescription className="text-gray-400">
                Provide detailed information about the item you want to sell
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 13 Pro - Excellent Condition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-200">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail (condition, features, reason for selling, etc.)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[150px] bg-gray-700 border-gray-600 text-gray-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-200">
                    Price (৳)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 65000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-200">
                      Category
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(value) => {
                        setCategory(value)
                        setSubcategory("")
                      }}
                      required
                    >
                      <SelectTrigger id="category" className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-gray-200">
                      Subcategory
                    </Label>
                    <Select value={subcategory} onValueChange={setSubcategory} disabled={!category} required>
                      <SelectTrigger id="subcategory" className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        {category &&
                          categories
                            .find((cat) => cat.name === category)
                            ?.subcategories.map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-gray-200">
                      Phone Number
                    </Label>
                   <Input
                    id="phone"
                    type="text"
                    placeholder="e.g., 0174xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200">Product Images (max 5)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {images.length < 5 && (
                      <label className="border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-gray-700">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Upload</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Posting Ad..." : "Post Ad"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Listing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1 text-gray-200">Take clear photos</h3>
                <p className="text-sm text-gray-400">
                  Good lighting and multiple angles help buyers see the item clearly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-200">Be detailed and honest</h3>
                <p className="text-sm text-gray-400">
                  Mention any flaws or issues with the item to avoid problems later.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-200">Price reasonably</h3>
                <p className="text-sm text-gray-400">Research similar items to set a competitive price.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-200">Respond quickly</h3>
                <p className="text-sm text-gray-400">Check your messages regularly to not miss potential buyers.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
