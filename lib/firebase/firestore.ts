import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type DocumentData,
} from "firebase/firestore"
import { getApp } from "firebase/app"

// Get Firestore instance
const db = getFirestore(getApp())

// Product type
export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory: string
  images: string[]
  userId: string
  userDisplayName: string
  createdAt: string
  status: string
  phone:string
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("status", "==", "active"), orderBy("createdAt", "desc"))
    const productsSnapshot = await getDocs(q)

    return productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", id)
    const productSnapshot = await getDoc(productRef)

    if (!productSnapshot.exists()) {
      return null
    }

    return {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    } as Product
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      where("category", "==", category),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    )
    const productsSnapshot = await getDocs(q)

    return productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by category:", error)
    return []
  }
}

// Get products by subcategory
export async function getProductsBySubcategory(subcategory: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      where("subcategory", "==", subcategory),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    )
    const productsSnapshot = await getDocs(q)

    return productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by subcategory:", error)
    return []
  }
}

// Get products by user ID
export async function getProductsByUserId(userId: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const productsSnapshot = await getDocs(q)

    return productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by user ID:", error)
    return []
  }
}

// Add a new product
export async function addProduct(product: Omit<Product, "id">): Promise<string> {
  try {
    const productsRef = collection(db, "products")
    const docRef = await addDoc(productsRef, product)
    return docRef.id
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

// Update a product
export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  try {
    const productRef = doc(db, "products", id)
    await updateDoc(productRef, data as DocumentData)
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, "products", id)
    await deleteDoc(productRef)
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Firebase doesn't support full-text search natively
    // This is a simple implementation that gets all products and filters them
    // For a production app, consider using Algolia or another search service
    const products = await getProducts()
    const lowercaseQuery = query.toLowerCase()

    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.subcategory.toLowerCase().includes(lowercaseQuery),
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}
