import type { Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BsCheckAll } from "react-icons/bs"
import { formatMessageTime } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isCurrentUser ? "order-2" : "order-1"}`}>
        {!isCurrentUser && message.sender && (
          <div className="flex items-center mb-1">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={message.avatar || "/placeholder.svg?height=24&width=24"} alt={message.sender} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{message.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">{message.sender}</span>
            {message.phone && <span className="text-xs text-gray-500 ml-2">+{message.phone}</span>}
          </div>
        )}

        <div
          className={`rounded-lg p-3 ${
            isCurrentUser ? "bg-green-100 text-gray-800" : "bg-white border border-gray-200 text-gray-800"
          }`}
        >
          <p className="text-sm">{message.text}</p>

          <div className="flex items-center justify-end mt-1">
            <span className="text-xs text-gray-500 mr-1">{formatMessageTime(message.timestamp)}</span>
            {isCurrentUser && message.status === "read" && <BsCheckAll className="h-3.5 w-3.5 text-green-600" />}
          </div>
        </div>

        {message.email && (
          <div className="mt-1 text-xs text-gray-500 flex items-center">
            <span className="mr-1">✓</span>
            {message.email}
          </div>
        )}
      </div>
    </div>
  )
}
