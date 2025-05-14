"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFYAtLjVzuVqsRuR6u9jd8KbmaOyOjyFQ",
  authDomain: "adlister-lite.firebaseapp.com",
  projectId: "adlister-lite",
  storageBucket: "adlister-lite.firebasestorage.app",
  messagingSenderId: "85489853041",
  appId: "1:85489853041:web:7a3572e101c32e85b531d0"
}

// Initialize Firebase
let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  // Prevent multiple initializations in development
  console.error("Firebase initialization error", error)
}

const auth = getAuth(app)

// Auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if(user)
      localStorage.setItem("user",JSON.stringify(user))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(()=>{
    const localuser=localStorage.getItem("user")
    if(localuser){
      setUser(JSON.parse(localuser))
    }
  },[])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
