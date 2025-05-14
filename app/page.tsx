"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCategories from "@/components/product-categories"
import FeaturedProducts from "@/components/featured-products"
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Home() {
const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (!user) {
      // Not logged in, redirect to login
      router.replace('/');
    }

    // Optional: If user exists, you can parse and use it
    // const userObj = JSON.parse(user);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-200">
      <section className="py-6 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl mb-12 text-white">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Handoff.io</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Buy and sell products with fellow students at Bangladesh University Business & Technology
          </p>
          <div className="flex gap-4">
            <Button size="sm" className="bg-white text-blue-700 hover:bg-gray-100">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-none">
              <Link href="/products/new">Sell an Item</Link>
            </Button>
          </div>
        </div>
      </section>

      <ProductCategories />
      <FeaturedProducts />

      <section className="py-12 bg-gray-800 rounded-xl my-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">How Handoff.io Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-900 text-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">List Your Item</h3>
              <p className="text-gray-300">Take photos and add details about your item to create a listing.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-900 text-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Chat with Buyers/Sellers</h3>
              <p className="text-gray-300">Communicate directly with other students through our in-app chat.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-900 text-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Complete the Handoff</h3>
              <p className="text-gray-300">Meet on campus to exchange the item and payment safely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
