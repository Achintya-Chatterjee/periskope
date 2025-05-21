export interface Message {
  id?: string
  text: string
  sender: string
  timestamp: Date
  status?: "sent" | "delivered" | "read"
  avatar?: string
  phone?: string
  email?: string
}

export interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage?: {
    text: string
    timestamp: Date
  }
  lastMessageTime: Date
  lastMessageStatus?: "sent" | "delivered" | "read"
  unreadCount: number
  tags?: string[]
  phone?: string
  phoneExt?: string
  participants?: string[]
  messages?: Message[]
}
