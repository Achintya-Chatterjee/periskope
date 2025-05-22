"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth-provider";
import type { Chat, Message as MessageType, Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FaMicrophone, FaRegClock } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import ChatMessage from "./chat-message";
import { HiChevronUpDown } from "react-icons/hi2";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { PiClockClockwiseLight, PiStarFourLight } from "react-icons/pi";
import { IoMdListBox } from "react-icons/io";
import Spinner from "@/components/spinner";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
}

const transformMessage = (rawMessage: any): MessageType => {
  return {
    id: rawMessage.id,
    chat_id: rawMessage.chat_id,
    text: rawMessage.content,
    sender_id: rawMessage.sender_id,
    created_at: rawMessage.created_at,
    timestamp: rawMessage.created_at
      ? new Date(rawMessage.created_at)
      : new Date(),
    status: rawMessage.status,
    attachment_url: rawMessage.attachment_url,
  } as MessageType;
};

export default function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const [displayedMessages, setDisplayedMessages] = useState<MessageType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [participantProfiles, setParticipantProfiles] = useState<
    Record<string, Pick<Profile, "id" | "full_name" | "avatar_url">>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!chat?.id) return;

    const fetchChatData = async () => {
      setIsLoadingMessages(true);
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        setDisplayedMessages([]);
      } else {
        setDisplayedMessages((messagesData || []).map(transformMessage));
      }

      // Fetch participants and their profiles
      type ParticipantWithProfile = {
        user_id: string;
        profiles: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
      };

      const { data: participantsData, error: participantsError } =
        await supabase
          .from("chat_participants")
          .select("user_id, profiles(id, full_name, avatar_url)")
          .eq("chat_id", chat.id)
          .returns<ParticipantWithProfile[]>(); // Explicitly type the return

      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        setParticipantProfiles({});
      } else {
        const profilesMap: Record<
          string,
          Pick<Profile, "id" | "full_name" | "avatar_url">
        > = {};
        participantsData?.forEach((p) => {
          if (p.profiles) {
            profilesMap[p.user_id] = p.profiles;
          }
        });
        setParticipantProfiles(profilesMap);
      }
      setIsLoadingMessages(false);
    };

    fetchChatData();
  }, [chat.id]);

  useEffect(() => {
    if (!chat?.id) return;

    const channel = supabase
      .channel(`chat:${chat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          console.log("New message received via realtime:", payload);
          const transformedNewMessage = transformMessage(payload.new);
          setDisplayedMessages((prevMessages) => {
            if (
              prevMessages.find((msg) => msg.id === transformedNewMessage.id)
            ) {
              return prevMessages;
            }
            return [...prevMessages, transformedNewMessage];
          });
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(`Subscribed to chat ${chat.id}`);
        }
        if (status === "CHANNEL_ERROR") {
          console.error(`Realtime channel error for chat ${chat.id}:`, err);
        }
        if (status === "TIMED_OUT") {
          console.warn(`Realtime subscription timed out for chat ${chat.id}`);
        }
      });

    return () => {
      console.log(`Unsubscribing from chat ${chat.id}`);
      supabase.removeChannel(channel);
    };
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessageInternal = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageInternal();
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="small" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {displayedMessages.map((message, index) => {
            const senderProfile = participantProfiles[message.sender_id];
            return (
              <ChatMessage
                key={message.id || index}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
                senderFullName={senderProfile?.full_name || null}
                senderAvatarUrl={senderProfile?.avatar_url || null}
              />
            );
          })}
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
              onClick={handleSendMessageInternal}
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
