"use client";

import type { Chat } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MdStarPurple500 } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

interface ChatContextHeaderProps {
  chat: Chat | null;
}

export default function ChatContextHeader({ chat }: ChatContextHeaderProps) {
  if (!chat) {
    return null;
  }

  const participantsToDisplay = chat.participants || [];
  const maxVisibleAvatars = 3;
  const visibleAvatars = participantsToDisplay.slice(0, maxVisibleAvatars);
  const hiddenAvatarCount = participantsToDisplay.length - maxVisibleAvatars;

  const chatName = chat.name || "Chat";

  const participantString = participantsToDisplay
    .filter((p) => typeof p === "string")
    .join(", ");

  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex flex-col truncate mr-4">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {chatName}
        </h2>
        {participantString && (
          <p className="text-xs text-gray-500 truncate">{participantString}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2 overflow-hidden">
          {visibleAvatars.map((participant, index) => (
            <Avatar
              key={index}
              className="h-7 w-7 border-2 border-white ring-1 ring-gray-300"
            >
              <AvatarFallback className="bg-gray-200 text-gray-600 text-[10px]">
                {typeof participant === "string"
                  ? participant.substring(0, 1).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          ))}
          {hiddenAvatarCount > 0 && (
            <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 ring-1 ring-gray-300">
              +{hiddenAvatarCount}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:bg-gray-100"
        >
          <MdStarPurple500 className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:bg-gray-100"
        >
          <CiSearch className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
