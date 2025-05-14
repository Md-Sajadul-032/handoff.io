"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send } from "lucide-react"

// This would normally come from Firebase
const mockChats = [
  {
    id: "chat1",
    participants: ["user1", "user2"],
    productId: "1",
    productTitle: "iPhone 13 Pro - Excellent Condition",
    lastMessage: "Is this still available?",
    lastMessageTime: new Date(),
    otherUser: {
      id: "user2",
      displayName: "Rahul Ahmed",
      photoURL: null,
    },
  },
  {
    id: "chat2",
    participants: ["user1", "user3"],
    productId: "2",
    productTitle: "Dell XPS 15 Laptop - 16GB RAM, 512GB SSD",
    lastMessage: "Can you meet tomorrow at the library?",
    lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
    otherUser: {
      id: "user3",
      displayName: "Farhan Khan",
      photoURL: null,
    },
  },
  {
    id: "chat3",
    participants: ["user1", "user4"],
    productId: "3",
    productTitle: "Mountain Bike - Barely Used",
    lastMessage: "I'm interested in buying this. Is the price negotiable?",
    lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
    otherUser: {
      id: "user4",
      displayName: "Tasnim Rahman",
      photoURL: null,
    },
  },
]

// This would normally come from Firebase
const mockMessages = [
  {
    id: "msg1",
    chatId: "chat1",
    senderId: "user2",
    text: "Hi, is this iPhone still available?",
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  },
  {
    id: "msg2",
    chatId: "chat1",
    senderId: "user1",
    text: "Yes, it's still available. Are you interested?",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "msg3",
    chatId: "chat1",
    senderId: "user2",
    text: "Is this still available?",
    createdAt: new Date(), // now
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [chats, setChats] = useState(mockChats)
  const [messages, setMessages] = useState(mockMessages)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const newMsg = {
      id: `msg${Date.now()}`,
      chatId: selectedChat,
      senderId: user?.uid || "user1", // Fallback for mock
      text: newMessage,
      createdAt: new Date(),
    }

    setMessages([...messages, newMsg])

    // Update last message in chat list
    setChats(
      chats.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : chat,
      ),
    )

    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 86400000) {
      // Less than 1 day
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-white">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Chats</h1>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Chat List */}
          <div className="border-r border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search messages..." className="pl-9 bg-gray-700 border-gray-600 text-gray-200" />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(600px-65px)] bg-gray-800">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                      selectedChat === chat.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={chat.otherUser.photoURL || ""} />
                        <AvatarFallback className="bg-blue-900 text-blue-100">
                          {chat.otherUser.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium truncate text-gray-200">{chat.otherUser.displayName}</h3>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{chat.productTitle}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No chats yet. Start a conversation from a product page.
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="col-span-2 flex flex-col bg-gray-900">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-900 text-blue-100">
                        {chats.find((c) => c.id === selectedChat)?.otherUser.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-200">
                        {chats.find((c) => c.id === selectedChat)?.otherUser.displayName}
                      </h3>
                      <p className="text-xs text-gray-400">{chats.find((c) => c.id === selectedChat)?.productTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                  {messages
                    .filter((msg) => msg.chatId === selectedChat)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === (user?.uid || "user1") ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === (user?.uid || "user1")
                              ? "bg-blue-700 text-white"
                              : "bg-gray-700 text-gray-200"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === (user?.uid || "user1") ? "text-blue-200" : "text-gray-400"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-200"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-700 hover:bg-blue-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
