"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2 } from "lucide-react"
import ChatSection from "@/components/chat-section"
import { getProductById } from "@/lib/firebase/firestore"
import type { Product } from "@/lib/firebase/firestore"

export default function ProductPage({ params }: any) {
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(id)
        if (!fetchedProduct) {
          router.push("/products")
          return
        }
        setProduct(fetchedProduct)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">Product not found</p>
        <Link href="/products" className="text-blue-400 hover:underline block mt-4">
          Browse other products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
            <div className="relative aspect-square h-[50vh] w-full flex items-center justify-center">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                alt={product.title}
                fill
                className="object-contain mx-auto "
              />
            </div>
            {product.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded-md ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="description">
              <TabsList className="w-full bg-gray-800 text-gray-400">
                <TabsTrigger
                  value="description"
                  className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="flex-1 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="description"
                className="p-4 bg-gray-800 rounded-lg shadow-md mt-2 border border-gray-700"
              >
                <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
              </TabsContent>
              <TabsContent value="details" className="p-4 bg-gray-800 rounded-lg shadow-md mt-2 border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="font-medium text-gray-200">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Subcategory</p>
                    <p className="font-medium text-gray-200">{product.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Posted by</p>
                    <p className="font-medium text-gray-200">{product.userDisplayName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Posted on</p>
                    <p className="font-medium text-gray-200">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Product Info and Chat */}
        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
            <Badge className="mb-2 bg-blue-700 hover:bg-blue-600 text-blue-100">{product.subcategory}</Badge>
            <h1 className="text-2xl font-bold mb-2 text-white">{product.title}</h1>
            <p className="text-3xl font-bold text-blue-400 mb-6">৳{product.price.toLocaleString()}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3 text-gray-200">
                  {product.userDisplayName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-200">{product.userDisplayName}</p>
                  <p className="text-sm text-gray-400">Student</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <ChatSection phone={product.phone} />
          </div>

          {/* Safety Tips */}
          <div className="bg-yellow-900 border border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-100 mb-2">Safety Tips</h3>
            <ul className="text-sm text-yellow-200 space-y-1">
              <li>• Meet in a public place on campus</li>
              <li>• Check the item before paying</li>
              <li>• Don't share personal financial information</li>
              <li>• Report suspicious behavior</li>
            </ul>
          </div>

          {/* Similar Products */}
          
        </div>
      </div>
    </div>
  )
}
