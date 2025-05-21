"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Chat } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  FaSearch,
  FaPhone,
  FaMobile,
  FaPaperclip,
  FaSmile,
  FaClock,
  FaImage,
  FaMicrophone,
  FaPaperPlane,
} from "react-icons/fa"
import { BsChevronDown, BsThreeDotsVertical } from "react-icons/bs"
import { MdOutlineRefresh } from "react-icons/md"
import { IoMdHelp } from "react-icons/io"
import ChatMessage from "./chat-message"

interface ChatWindowProps {
  chat: Chat
  onSendMessage: (text: string) => void
}

export default function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [chat.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText)
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="font-medium text-gray-900">{chat.name}</h2>

          {chat.participants && <div className="ml-4 text-sm text-gray-500">{chat.participants.join(", ")}</div>}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MdOutlineRefresh className="h-4 w-4 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <IoMdHelp className="h-4 w-4 text-gray-600" />
          </Button>

          <div className="flex items-center text-yellow-500">
            <FaPhone className="h-4 w-4 mr-1" />
            <span className="text-sm">5 / 6 phones</span>
            <BsChevronDown className="h-4 w-4 ml-1" />
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FaMobile className="h-4 w-4 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FaSearch className="h-4 w-4 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BsThreeDotsVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {chat.messages?.map((message, index) => (
            <ChatMessage key={index} message={message} isCurrentUser={message.sender === "Periskope"} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center">
          <div className="flex items-center space-x-1 mr-2">
            <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2">
              <span className="text-sm">WhatsApp</span>
              <BsChevronDown className="h-4 w-4 ml-1" />
            </Button>

            <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2">
              <span className="text-sm">Private Note</span>
              <BsChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex-1 flex items-center border border-gray-300 rounded-md px-3 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <FaPaperclip className="h-5 w-5" />
            </Button>

            <textarea
              className="flex-1 outline-none resize-none text-sm h-8 py-1.5 px-2"
              placeholder="Message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <FaSmile className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <FaClock className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <FaImage className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <FaMicrophone className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button
            className="ml-2 bg-green-600 hover:bg-green-700 h-10 w-10 rounded-full p-0"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <FaPaperPlane className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mt-1 text-xs text-gray-500">
          <Avatar className="h-5 w-5 mr-1">
            <AvatarFallback className="bg-green-600 text-white text-xs">P</AvatarFallback>
          </Avatar>
          <span>Periskope</span>
        </div>
      </div>
    </div>
  )
}
