"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/lib/firebase/firestore"
import type { Product } from "@/lib/firebase/firestore"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white">Featured Products</h2>
          <div className="text-center py-12 text-gray-400">Loading products...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
          <Link href="/products" className="text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-blue-700 hover:bg-blue-600 text-blue-100">{product.subcategory}</Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">{product.title}</h3>
                    <p className="text-xl font-bold text-blue-400">৳{product.price.toLocaleString()}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 text-sm text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-4">No products have been posted yet</p>
            <Link href="/products/new" className="text-blue-400 hover:underline">
              Be the first to post a product
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
