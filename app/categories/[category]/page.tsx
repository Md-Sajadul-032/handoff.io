"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductsByCategory } from "@/lib/firebase/firestore"
import type { Product } from "@/lib/firebase/firestore"

const categories = [
  {
    name: "phone",
    displayName: "Phone",
    subcategories: ["Feature Phone", "Smart Phone", "Smart Watch"],
  },
  {
    name: "computer",
    displayName: "Computer",
    subcategories: ["Laptop", "Desktop", "Monitor", "Mouse", "Keyboard", "Others"],
  },
  {
    name: "vehicle",
    displayName: "Vehicle",
    subcategories: ["Bicycle", "Motorbikes"],
  },
  {
    name: "textbooks",
    displayName: "Textbooks",
    subcategories: ["CSE", "EEE", "Textile", "Civil"],
  },
]

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const router = useRouter()

  const category = categories.find((c) => c.name === params.category)

  useEffect(() => {
    if (!category) {
      router.push("/")
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const fetchedProducts = await getProductsByCategory(params.category)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.category, category, router])

  if (!category) {
    return null // This will redirect in the useEffect
  }

  const filteredProducts = selectedSubcategory
    ? products.filter((p) => p.subcategory === selectedSubcategory)
    : products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">{category.displayName}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Subcategories</h2>
        <div className="flex flex-wrap gap-2">
          {category.subcategories.map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => setSelectedSubcategory(selectedSubcategory === subcategory ? null : subcategory)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedSubcategory === subcategory
                  ? "bg-blue-700 text-white"
                  : "bg-blue-900 hover:bg-blue-800 text-white"
              }`}
            >
              {subcategory}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Products</h2>
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
              {selectedSubcategory
                ? `No products found in ${selectedSubcategory}`
                : `No products found in ${category.displayName}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
