"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Settings } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/firebase/auth"
import { useEffect, useState } from "react"
import { deleteProduct, getProductsByUserId, Product } from "@/lib/firebase/firestore"
import { toast } from "sonner"



// Mock listings data - would come from Firebase in the real implementation
const activeListings = [
  {
    id: "1",
    title: "MacBook Pro 2019",
    category: "Computers",
    subcategory: "Laptop",
    price: 65000,
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "2 days ago",
    views: 24,
  },
  {
    id: "2",
    title: "Data Structures Textbook",
    category: "Textbooks",
    subcategory: "CSE",
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
    createdAt: "1 week ago",
    views: 15,
  },
]

const soldItems = [
  {
    id: "3",
    title: "iPhone 12",
    category: "Phones",
    subcategory: "Smart Phone",
    price: 55000,
    image: "/placeholder.svg?height=200&width=300",
    soldDate: "3 months ago",
    buyer: "Fatima Khan",
  },
]

export default function ProfilePage() {
    const {user}=useAuth()
    const [products, setProducts] = useState<Product[]>([])

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
          alert("Successfully deleted")
          })
      
      
          
        }

      
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.photoURL||""} alt={user?.displayName||""} />
              <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user?.displayName||""}</CardTitle>
            <CardDescription className="max-w-xs">
              {user?.emailVerified}
              <div className="mt-1">{user?.email}</div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {/* <Button className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button> */}
            {/* <Link href="/profile/settings" className="w-full">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" /> Account Settings
              </Button>
            </Link> */}
          </CardContent>
        </Card>

        {/* Listings Tabs */}
        <div className="md:col-span-2">
          <Card>
                <CardHeader>
                  <CardTitle>Active Listings ({products.length})</CardTitle>
                  <CardDescription>
                    Manage your current listings on Handoff.io
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map((listing) => (
                        <div key={listing.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4">
                          <div className="relative h-40 sm:h-32 sm:w-48 rounded-md overflow-hidden">
                            <Image
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{listing.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
                                    {listing.subcategory}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Listed {listing.createdAt}
                                  </span>
                                </div>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                  ৳{listing.price.toLocaleString()}
                                </p>
                                
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(listing.id)}>Delete</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You don't have any active listings</p>
                      <Link href="/products/new">
                        <Button>Post an Ad</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
        </div>
      </div>
    </div>
  )
}
