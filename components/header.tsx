"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, MessageSquare, Package, LogOut, User, Search, Handshake } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Initialize search query from URL if on products page
  useState(() => {
    if (pathname === "/products") {
      const query = searchParams.get("search")
      if (query) {
        setSearchQuery(query)
      }
    }
  })

  return (
    <header className="bg-black border-b border-gray-800 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          <Link href="/" className="flex items-center">
              <Handshake className="h-7 w-7 text-green-500" />
              <h1 className="text-2xl font-bold ml-2">Handoff.io</h1>
            </Link>

          {/* Search Bar - Centered */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-1 h-8 w-full rounded-lg bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
               
                <Button
                  size="sm"
                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push("/products/new")}
                >
                  Post Ad
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-200">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => router.push("/messages")} className="hover:bg-gray-800">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => router.push("/my-products")} className="hover:bg-gray-800">
                      <Package className="mr-2 h-4 w-4" />
                      My Products
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-200 hover:bg-gray-800"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-200 hover:bg-gray-800"
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push("/products/new")}
                >
                  Post Ad
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="pl-10 pr-4 py-1 h-8 w-full rounded-lg bg-gray-800 border-gray-700 text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <nav className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-200 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  
                  <Link
                    href="/my-products"
                    className="text-gray-200 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Products
                  </Link>
                  <Link
                    href="/products/new"
                    className="text-gray-200 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Ad
                  </Link>
                  <button
                    className="text-left text-gray-200 hover:text-white"
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  
                  <Link href="/login" className="text-gray-200 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-200 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/products/new"
                    className="text-gray-200 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Ad
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
