"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth"
import { useToast } from "@/components/ui/use-toast"
import { createChat, sendMessage } from "@/lib/firebase/chat"
import { getProductById } from "@/lib/firebase/firestore"
import { Input } from "./ui/input"

export default function ChatSection({ phone }: {phone: string }) {


  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center text-white">
        <MessageSquare className="h-5 w-5 mr-2" />
        Contact Seller
      </h3>
      <Input
        placeholder="Seller phone number"
        value={phone}
        disabled
        className="!text-xl !text-white"
      />
      
    </div>
  )
}
