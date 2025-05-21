"use client"

import type { Chat } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BsCheck, BsCheckAll, BsTelephone } from "react-icons/bs"
import { formatChatDate } from "@/lib/utils"

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
  onClick: () => void
}

export default function ChatListItem({ chat, isSelected, onClick }: ChatListItemProps) {
  return (
    <div
      className={`p-4 border-b border-gray-200 flex cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""}`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 mr-3">
        {chat.avatar ? (
          <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
        ) : (
          <AvatarFallback className="bg-gray-200 text-gray-600">{chat.name.charAt(0)}</AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatChatDate(chat.lastMessageTime)}</span>
        </div>

        <div className="flex items-center mt-1">
          {chat.lastMessageStatus === "read" && <BsCheckAll className="h-3.5 w-3.5 text-gray-400 mr-1 flex-shrink-0" />}
          {chat.lastMessageStatus === "delivered" && (
            <BsCheck className="h-3.5 w-3.5 text-gray-400 mr-1 flex-shrink-0" />
          )}
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage?.text}</p>
        </div>

        <div className="flex items-center mt-1.5 space-x-1">
          {chat.phone && (
            <div className="flex items-center text-xs text-gray-500">
              <BsTelephone className="h-3 w-3 mr-1" />
              <span>
                {chat.phone}
                {chat.phoneExt && <span className="ml-1">+{chat.phoneExt}</span>}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-1 ml-auto">
            {chat.tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs px-2 py-0.5 h-5 ${
                  tag.toLowerCase() === "demo"
                    ? "border-orange-300 text-orange-600 bg-orange-50"
                    : tag.toLowerCase() === "internal"
                      ? "border-green-300 text-green-600 bg-green-50"
                      : tag.toLowerCase() === "signup"
                        ? "border-green-300 text-green-600 bg-green-50"
                        : tag.toLowerCase() === "content"
                          ? "border-green-300 text-green-600 bg-green-50"
                          : tag.toLowerCase() === "dont send"
                            ? "border-red-300 text-red-600 bg-red-50"
                            : "border-gray-300 text-gray-600"
                }`}
              >
                {tag}
              </Badge>
            ))}

            {chat.unreadCount > 0 && (
              <Badge className="bg-green-600 h-5 w-5 p-0 flex items-center justify-center">{chat.unreadCount}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
