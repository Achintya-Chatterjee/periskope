"use client";

import type { Chat, Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MdStarPurple500 } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { TbMessageCirclePlus } from "react-icons/tb";

interface ChatContextHeaderProps {
  chat: Chat | null;
  onManageParticipantsClick: () => void;
}

export default function ChatContextHeader({
  chat,
  onManageParticipantsClick,
}: ChatContextHeaderProps) {
  if (!chat) {
    return null;
  }

  const participantProfiles: Partial<Profile>[] = (chat.participants || []).map(
    (p) => {
      if (typeof p === "string") {
        return { id: p, full_name: p };
      }
      return p;
    }
  );

  const maxVisibleAvatars = 3;
  const visibleAvatars = participantProfiles.slice(0, maxVisibleAvatars);
  const hiddenAvatarCount = Math.max(
    0,
    participantProfiles.length - maxVisibleAvatars
  );

  const chatName = chat.name || "Chat";

  const participantString = participantProfiles
    .map((p) => p.full_name || "Unknown")
    .filter((name) => name !== "Unknown")
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
          {visibleAvatars.map((participant) => (
            <Avatar
              key={participant.id}
              className="h-7 w-7 border-2 border-white ring-1 ring-gray-300"
            >
              <AvatarImage
                src={participant.avatar_url || undefined}
                alt={participant.full_name || "User"}
              />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-[10px]">
                {participant.full_name
                  ? participant.full_name.substring(0, 1).toUpperCase()
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
          className="h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-green-500 manage-participants-btn"
          onClick={onManageParticipantsClick}
          title="Manage Participants Test"
        >
          <TbMessageCirclePlus className="h-5 w-5" />
        </Button>

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
