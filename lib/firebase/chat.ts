import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore"
import { getApp } from "firebase/app"

// Get Firestore instance
const db = getFirestore(getApp())

// Message type
export interface Message {
  id: string
  chatId: string
  senderId: string
  text: string
  createdAt: Timestamp
}

// Chat type
export interface Chat {
  id: string
  participants: string[]
  productId: string
  productTitle: string
  lastMessage: string
  lastMessageTime: Timestamp
}

// Create a new chat
export async function createChat(
  sellerId: string,
  buyerId: string,
  productId: string,
  productTitle: string,
): Promise<string> {
  const chatsRef = collection(db, "chats")
  const chatDoc = await addDoc(chatsRef, {
    participants: [sellerId, buyerId],
    productId,
    productTitle,
    lastMessage: "",
    lastMessageTime: Timestamp.now(),
  })

  return chatDoc.id
}

// Send a message
export async function sendMessage(chatId: string, senderId: string, text: string): Promise<string> {
  const messagesRef = collection(db, "messages")
  const messageDoc = await addDoc(messagesRef, {
    chatId,
    senderId,
    text,
    createdAt: Timestamp.now(),
  })

  // Update the last message in the chat
  const chatRef = doc(db, "chats", chatId)
  await getDoc(chatRef).then((chatDoc) => {
    if (chatDoc.exists()) {
      chatDoc.ref.update({
        lastMessage: text,
        lastMessageTime: Timestamp.now(),
      })
    }
  })

  return messageDoc.id
}

// Get chats for a user
export function getUserChats(userId: string, callback: (chats: Chat[]) => void) {
  const chatsRef = collection(db, "chats")
  const q = query(chatsRef, where("participants", "array-contains", userId), orderBy("lastMessageTime", "desc"))

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[]

    callback(chats)
  })
}

// Get messages for a chat
export function getChatMessages(chatId: string, callback: (messages: Message[]) => void) {
  const messagesRef = collection(db, "messages")
  const q = query(messagesRef, where("chatId", "==", chatId), orderBy("createdAt", "asc"))

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[]

    callback(messages)
  })
}
