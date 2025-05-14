"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Edit, MoreVertical, PlusCircle, Trash } from "lucide-react"
import { deleteProduct, getProductsByUserId, Product } from "@/lib/firebase/firestore"

// This would normally come from Firebase
const mockProducts = [
  {
    id: "1",
    title: "iPhone 13 Pro - Excellent Condition",
    price: 65000,
    category: "Phone",
    subcategory: "Smart Phone",
    image: "/placeholder.svg?height=300&width=300",
    createdAt: new Date().toISOString(),
    status: "active",
  },
  {
    id: "2",
    title: "Dell XPS 15 Laptop - 16GB RAM, 512GB SSD",
    price: 85000,
    category: "Computer",
    subcategory: "Laptop",
    image: "/placeholder.svg?height=300&width=300",
    createdAt: new Date().toISOString(),
    status: "active",
  },
  {
    id: "3",
    title: "Mountain Bike - Barely Used",
    price: 12000,
    category: "Vehicle",
    subcategory: "Bicycle",
    image: "/placeholder.svg?height=300&width=300",
    createdAt: new Date().toISOString(),
    status: "sold",
  },
]

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()


  const getAllMyProducts=async(uid:any)=>{
    const products=await getProductsByUserId(uid)

    setProducts(products)
  }

  useEffect(()=>{
    if(user){
      getAllMyProducts(user.uid)
    }
  },[user])

  const handleDeleteProduct = async(id: string) => {
    // In a real app, this would delete the product from Firebase
    await deleteProduct(id).then(()=>{
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Product deleted",
      description: "Your product has been deleted successfully",
    })
    })


    
  }

  const handleMarkAsSold = (id: string) => {
    // In a real app, this would update the product status in Firebase
    setProducts(products.map((product) => (product.id === id ? { ...product, status: "sold" } : product)))

    toast({
      title: "Product marked as sold",
      description: "Your product has been marked as sold",
    })
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button onClick={() => router.push("/products/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Sell an Item
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Listings</TabsTrigger>
          <TabsTrigger value="sold">Sold Items</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => product.status === "active")
              .map((product) => (
                <Card key={product.id} className="h-full">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{product.subcategory}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* <DropdownMenuItem onClick={() => router.push(`/products/edit/${product.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkAsSold(product.id)}>Mark as Sold</DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-xl font-bold text-blue-700">৳{product.price.toLocaleString()}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</span>
                    <Link href={`/products/${product.id}`} className="text-sm text-blue-700 hover:underline">
                      View
                    </Link>
                  </CardFooter>
                </Card>
              ))}

            {products.filter((product) => product.status === "active").length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">You don't have any active listings</p>
                <Button onClick={() => router.push("/products/new")}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Sell an Item
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sold">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => product.status === "sold")
              .map((product) => (
                <Card key={product.id} className="h-full relative">
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center z-10">
                    <Badge variant="outline" className="bg-white text-lg px-4 py-2">
                      SOLD
                    </Badge>
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{product.subcategory}</Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-xl font-bold text-blue-700">৳{product.price.toLocaleString()}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</span>
                    <Link href={`/products/${product.id}`} className="text-sm text-blue-700 hover:underline">
                      View
                    </Link>
                  </CardFooter>
                </Card>
              ))}

            {products.filter((product) => product.status === "sold").length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">You don't have any sold items yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
