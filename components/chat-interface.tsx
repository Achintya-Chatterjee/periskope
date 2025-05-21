"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import ChatWindow from "./chat-window"
import type { Chat } from "@/lib/types"
import { chats } from "@/lib/data"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChats, setFilteredChats] = useState(chats)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query.toLowerCase()) ||
          chat.lastMessage?.text.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredChats(filtered)
    }
  }

  const handleSendMessage = (text: string) => {
    if (!selectedChat) return

    // In a real app, you would send this to an API
    console.log(`Sending message to ${selectedChat.name}: ${text}`)
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        chats={filteredChats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      {selectedChat ? (
        <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}
