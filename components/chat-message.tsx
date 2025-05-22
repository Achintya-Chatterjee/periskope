import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsCheckAll } from "react-icons/bs";
import { formatMessageTime } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  senderFullName: string | null;
  senderAvatarUrl: string | null;
}

export default function ChatMessage({
  message,
  isCurrentUser,
  senderFullName,
  senderAvatarUrl,
}: ChatMessageProps) {
  const displayName = senderFullName || "User";
  const fallbackInitial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 order-1">
          <AvatarImage src={senderAvatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[70%] flex flex-col ${
          isCurrentUser ? "items-end order-1" : "items-start order-2"
        }`}
      >
        {!isCurrentUser && senderFullName && (
          <span className="text-xs text-gray-500 mb-0.5 px-2">
            {senderFullName}
          </span>
        )}
        <div
          className={`rounded-lg p-3 text-sm ${
            isCurrentUser
              ? "bg-green-100 text-gray-800 rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
          }`}
        >
          <p>{message.text}</p>
          <div
            className={`flex items-center mt-1 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-xs mr-1 ${
                isCurrentUser ? "text-green-700 opacity-80" : "text-gray-500"
              }`}
            >
              {formatMessageTime(message.timestamp || new Date())}
            </span>
            {isCurrentUser && message.status === "read" && (
              <BsCheckAll className="h-4 w-4 text-green-600" />
            )}
            {isCurrentUser && message.status === "sent" && (
              <BsCheckAll className="h-4 w-4 text-green-600 opacity-50" />
            )}
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8 order-2">
          <AvatarImage src={senderAvatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
