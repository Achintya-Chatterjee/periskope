"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Chat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FaMicrophone, FaRegClock } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import ChatMessage from "./chat-message";
import { HiChevronUpDown } from "react-icons/hi2";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { PiClockClockwiseLight, PiStarFourLight } from "react-icons/pi";
import { IoMdListBox } from "react-icons/io";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
}

export default function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat && chat.messages) {
      scrollToBottom();
    }
  }, [chat, chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {chat.messages?.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              message={message}
              isCurrentUser={message.sender === "Periskope"}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className=" flex flex-col z-10">
        {/* Message input area */}
        <div className="flex items-center px-4 py-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Message..."
              className="w-full py-2 px-4 focus:outline-none focus:ring-0 rounded-md"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="flex items-center ml-4">
            <Button
              className="bg-green-600 hover:bg-green-700 rounded-full p-3 text-white h-10 w-10 flex items-center justify-center"
              onClick={handleSendMessage}
              aria-label="Send message"
            >
              <IoSend className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <ImAttachment className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <BsEmojiSmile className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <FaRegClock className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <PiClockClockwiseLight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <PiStarFourLight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <IoMdListBox className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <FaMicrophone className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 h-8 text-sm font-normal  flex items-center gap-1"
            >
              <img
                src="/periskope-logo.jpeg"
                alt="Periskope logo"
                className="h-5 w-5 mr-1"
              />
              Periskope
              <HiChevronUpDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
