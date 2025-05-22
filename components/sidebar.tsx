"use client";

import { useState } from "react";
import type { Chat } from "@/lib/types";
import { FaChartLine, FaListUl } from "react-icons/fa6";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { IoTicketSharp } from "react-icons/io5";
import { CiBullhorn } from "react-icons/ci";
import { FaCodeBranch, FaSearch } from "react-icons/fa";
import { RiContactsBookFill, RiFolderDownloadFill } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { MdChecklist } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { PiCirclesThreeBold } from "react-icons/pi";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";

import ChatListItem from "./chat-list-item";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  allAvailableTags: string[];
  activeTagFilter: string | null;
  onTagFilterChange: (tag: string | null) => void;
}

export default function Sidebar({
  chats,
  selectedChat,
  onSelectChat,
  searchQuery,
  onSearch,
  allAvailableTags,
  activeTagFilter,
  onTagFilterChange,
}: SidebarProps) {
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState(false);

  return (
    <>
      <div className="flex h-full">
        {/* Left navigation bar with logo */}
        <div className="w-16 bg-white flex flex-col items-center py-4">
          <div className="flex flex-col items-center flex-grow">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <AiFillHome className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-green-50 relative mb-0"
            >
              <AiFillMessage className="h-6 w-6 text-green-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <IoTicketSharp className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <FaChartLine className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <FaListUl className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <CiBullhorn className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <FaCodeBranch className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <RiContactsBookFill className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <GrGallery className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <MdChecklist className="h-6 w-6 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative mb-0"
            >
              <IoIosSettings className="h-6 w-6 text-gray-600" />
            </Button>

            <div className="mt-auto flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative mb-0"
              >
                <PiCirclesThreeBold className="h-6 w-6 text-gray-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative mb-0"
              >
                <TbLayoutSidebarLeftExpandFilled className="h-6 w-6 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat list sidebar */}
        <div className="w-[364px] flex flex-col h-full overflow-hidden border-r border-gray-200">
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className={`text-xs px-3 py-1 h-8 rounded-md flex items-center font-semibold border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                    isCustomFilterOpen
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "text-green-600 bg-transparent hover:bg-green-100"
                  }`}
                  onClick={() => setIsCustomFilterOpen(!isCustomFilterOpen)}
                >
                  <RiFolderDownloadFill className="h-4 w-4 mr-2" />
                  Custom filter
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-1 h-8 text-gray-600"
                >
                  Save
                </Button>
              </div>

              <div className="relative">
                <FaSearch className="h-3 w-3 absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-8 pr-2 py-1 h-8 text-sm border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs px-3 py-1 h-8 text-gray-600"
              >
                <IoFilter className="h-3 w-3 mr-2 text-current" />
                Filtered
                <Badge className="ml-1 bg-green-600 h-5 w-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>

          {/* Tags Filter Area */}
          {allAvailableTags.length > 0 && (
            <div className="px-4 pt-2 pb-2 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={!activeTagFilter ? "secondary" : "outline"}
                  className={`text-xs px-3 py-1 h-auto rounded-full ${
                    !activeTagFilter
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onTagFilterChange(null)}
                >
                  All Chats
                </Button>
                {allAvailableTags.map((tag) => (
                  <Button
                    key={tag}
                    size="sm"
                    variant={activeTagFilter === tag ? "secondary" : "outline"}
                    className={`text-xs px-3 py-1 h-auto rounded-full ${
                      activeTagFilter === tag
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onTagFilterChange(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

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
    </>
  );
}
