"use client"

import { useState } from "react"
import type { Chat } from "@/lib/types"
import { FaSearch, FaFilter, FaHome, FaChartBar, FaUsers, FaBell, FaCog } from "react-icons/fa"
import { BsChatLeftFill } from "react-icons/bs"
import ChatListItem from "./chat-list-item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  chats: Chat[]
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
  searchQuery: string
  onSearch: (query: string) => void
}

export default function Sidebar({ chats, selectedChat, onSelectChat, searchQuery, onSearch }: SidebarProps) {
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState(false)

  return (
    <div className="w-[380px] flex h-full border-r border-gray-200">
      {/* Left navigation bar */}
      <div className="w-16 bg-gray-50 flex flex-col items-center py-4 border-r border-gray-200">
        <div className="mb-8">
          <Avatar className="h-10 w-10 bg-green-600">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="P" />
            <AvatarFallback className="bg-green-600 text-white text-lg">P</AvatarFallback>
          </Avatar>
          <div className="text-xs text-center mt-1 text-gray-600">12</div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <FaHome className="h-5 w-5 text-gray-500" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full bg-green-50 relative">
            <BsChatLeftFill className="h-5 w-5 text-green-600" />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              12
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <FaChartBar className="h-5 w-5 text-gray-500" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <FaUsers className="h-5 w-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <FaBell className="h-5 w-5 text-gray-500" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full relative mt-auto">
            <FaCog className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center text-gray-500 mr-2">
              <BsChatLeftFill className="h-4 w-4 mr-2 text-gray-400" />
              <h1 className="text-base font-normal">chats</h1>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-2">
              <Button
                variant={isCustomFilterOpen ? "default" : "outline"}
                size="sm"
                className={`text-xs px-3 py-1 h-8 ${isCustomFilterOpen ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-600"}`}
                onClick={() => setIsCustomFilterOpen(!isCustomFilterOpen)}
              >
                <FaFilter className="h-3 w-3 mr-2 text-current" />
                Custom filter
              </Button>

              <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 text-gray-600">
                Save
              </Button>
            </div>

            <div className="relative">
              <FaSearch className="h-3 w-3 absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-1 h-8 text-sm border border-gray-300 rounded-md w-32 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>

            <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 text-gray-600">
              <FaFilter className="h-3 w-3 mr-2 text-current" />
              Filtered
              <Badge className="ml-1 bg-green-600 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
