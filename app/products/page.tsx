"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { getProducts } from "@/lib/firebase/firestore"
import type { Product } from "@/lib/firebase/firestore"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)

        // Check for search query in URL
        const query = searchParams.get("search")
        if (query) {
          setSearchQuery(query)
          filterProducts(fetchedProducts, query)
        } else {
          setFilteredProducts(fetchedProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const filterProducts = (productsToFilter: Product[], query: string) => {
    const lowercaseQuery = query.toLowerCase()
    const filtered = productsToFilter.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.subcategory.toLowerCase().includes(lowercaseQuery),
    )
    setFilteredProducts(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterProducts(products, searchQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">All Products</h1>

      

      {loading ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
          <p className="text-gray-400">
            {searchQuery ? `No products found matching "${searchQuery}"` : "No products have been posted yet"}
          </p>
          <Link href="/products/new" className="text-blue-400 hover:underline block mt-4">
            Post a product
          </Link>
        </div>
      )}
    </div>
  )
}
