"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import ChatWindow from "./chat-window";
import Header from "./header";
import RightMainSidebar from "./right-main-sidebar";
import ChatContextHeader from "./chat-context-header";
import type { Chat } from "@/lib/types";
import { chats } from "@/lib/data";

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    console.log("selectedChat changed:", selectedChat);
    if (selectedChat) {
      console.log(
        "Selected chat ID:",
        selectedChat.id,
        "Name:",
        selectedChat.name
      );
      console.log("Participants:", selectedChat.participants);
    }
  }, [selectedChat]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query.toLowerCase()) ||
          (chat.lastMessage?.text.toLowerCase().includes(query.toLowerCase()) ??
            false)
      );
      setFilteredChats(filtered);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!selectedChat) return;

    console.log(`Sending message to ${selectedChat.name}: ${text}`);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      <div className="fixed top-0 bottom-0 left-16 w-px bg-gray-200 z-10"></div>

      <Header selectedChat={selectedChat} />
      <div className="flex flex-1 pt-14 overflow-hidden pr-16">
        <Sidebar
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <div className="flex flex-col h-full overflow-y-hidden">
              <ChatContextHeader chat={selectedChat} />
              <ChatWindow
                chat={selectedChat}
                onSendMessage={handleSendMessage}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-center px-4">
                Select a chat to start messaging or view chat details here.
              </p>
            </div>
          )}
        </main>
        <RightMainSidebar />
      </div>
    </div>
  );
}
