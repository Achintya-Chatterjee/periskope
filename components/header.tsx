"use client";

import { useAuth } from "./auth-provider";
import type { Chat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AiFillMessage } from "react-icons/ai";
import { LuRefreshCcwDot } from "react-icons/lu";
import { RiQuestionLine } from "react-icons/ri";
import { HiChevronUpDown, HiOutlineListBullet } from "react-icons/hi2";
import { TbDeviceDesktopDown } from "react-icons/tb";
import { BiSolidBellOff } from "react-icons/bi";

interface HeaderProps {
  selectedChat: Chat | null;
  onBack?: () => void;
}

export default function Header({ selectedChat, onBack }: HeaderProps) {
  const { signOut, user } = useAuth();
  return (
    <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center h-full">
        <Button variant="ghost" size="icon" className="h-10 w-10 mr-1 p-0">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/periskope-logo.jpeg" alt="Periskope" />
              <AvatarFallback className="bg-green-600 text-white text-sm">
                P
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
              12
            </span>
          </div>
        </Button>
        <AiFillMessage className="h-5 w-5 mx-1 text-gray-500" />
        <h1 className="text-base font-normal text-gray-700">chats</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 h-9 text-sm font-normal border-gray-200"
        >
          <LuRefreshCcwDot className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 h-9 text-sm font-normal border-gray-200"
        >
          <RiQuestionLine className="h-4 w-3 mr-2" />
          Help
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 h-9 text-sm font-normal border-gray-200"
        >
          <span className="text-sm text-yellow-500 flex items-center">
            <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
            5 / 6 phones
            <HiChevronUpDown className="h-4 w-4 ml-1" />
          </span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 text-gray-600 border-gray-200"
        >
          <TbDeviceDesktopDown className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 text-gray-600 border-gray-200"
        >
          <BiSolidBellOff className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 text-gray-600 border-gray-200"
        >
          <HiOutlineListBullet className="h-5 w-5" />
        </Button>

        {user && (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 h-9 text-sm font-normal border-gray-200"
            onClick={signOut}
          >
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}
