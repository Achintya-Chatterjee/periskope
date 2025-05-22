"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "./sidebar";
import ChatWindow from "./chat-window";
import Header from "./header";
import RightMainSidebar from "./right-main-sidebar";
import ChatContextHeader from "./chat-context-header";
import type { Chat, Message as MessageType, Profile } from "@/lib/types";

interface ParticipantWithProfile {
  user_id: string;
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
}

export default function ChatInterface() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      const fetchUserChats = async () => {
        setIsLoadingChats(true);
        try {
          const { data: participantEntries, error: participantError } =
            await supabase
              .from("chat_participants")
              .select("chat_id")
              .eq("user_id", user.id);

          if (participantError) throw participantError;
          if (!participantEntries || participantEntries.length === 0) {
            setUserChats([]);
            setFilteredChats([]);
            setIsLoadingChats(false);
            return;
          }

          const chatIds = participantEntries.map((p) => p.chat_id);

          const { data: chatsData, error: chatsError } = await supabase
            .from("chats")
            .select("id, name, avatar_url, created_at")
            .in("id", chatIds);

          if (chatsError) throw chatsError;
          if (!chatsData) {
            setUserChats([]);
            setFilteredChats([]);
            setIsLoadingChats(false);
            return;
          }

          const formattedChatsPromises = chatsData.map(async (chatEntry) => {
            let participants: ParticipantWithProfile[] | null = null;
            let lastMessageData: any = null;
            let chatName = chatEntry.name;
            let chatAvatar = chatEntry.avatar_url;
            const participantDisplayNames: string[] = [];

            try {
              const { data: fetchedParticipants, error: participantsError } =
                (await supabase
                  .from("chat_participants")
                  .select("user_id, profiles(id, full_name, avatar_url)")
                  .eq("chat_id", chatEntry.id)) as {
                  data: ParticipantWithProfile[] | null;
                  error: any;
                };

              if (participantsError) {
                console.error(
                  "[ChatFormat Inner Catch] Critical: Error fetching participants for chat",
                  chatEntry.id,
                  "Raw Error:",
                  participantsError,
                  "Stringified:",
                  JSON.stringify(participantsError, null, 2)
                );
                throw participantsError;
              }
              participants = fetchedParticipants;
            } catch (err) {
              console.error(
                "[ChatFormat Outer Catch] Error during participant fetch for chat:",
                chatEntry.id,
                err,
                JSON.stringify(err, null, 2)
              );

              return null;
            }

            if (participants && participants.length > 0) {
              participants.forEach((p) => {
                if (p.profiles && p.profiles.full_name) {
                  participantDisplayNames.push(p.profiles.full_name);
                }
              });

              if (!chatName && participants.length === 2) {
                const otherParticipant = participants.find(
                  (p) => p.user_id !== user?.id
                );
                if (otherParticipant && otherParticipant.profiles) {
                  chatName = otherParticipant.profiles.full_name || "Chat User";
                  chatAvatar = otherParticipant.profiles.avatar_url;
                }
              }
            }
            chatName = chatName || "Unnamed Chat";

            try {
              const { data: fetchedLastMessage, error: lastMessageError } =
                await supabase
                  .from("messages")
                  .select("content, created_at, sender_id, status")
                  .eq("chat_id", chatEntry.id)
                  .order("created_at", { ascending: false })
                  .limit(1)
                  .maybeSingle();

              if (lastMessageError) {
                console.error(
                  "[ChatFormat Inner Catch] Critical: Error fetching last message for chat",
                  chatEntry.id,
                  "Raw Error:",
                  lastMessageError,
                  "Stringified:",
                  JSON.stringify(lastMessageError, null, 2)
                );
                throw lastMessageError;
              }
              lastMessageData = fetchedLastMessage;
            } catch (err) {
              console.error(
                "[ChatFormat Outer Catch] Error during last message fetch for chat:",
                chatEntry.id,
                err,
                JSON.stringify(err, null, 2)
              );
              return null;
            }

            return {
              id: chatEntry.id,
              name: chatName,
              avatar: chatAvatar || undefined,
              lastMessage: lastMessageData
                ? {
                    text: lastMessageData.content,
                    timestamp: new Date(lastMessageData.created_at),
                  }
                : {
                    text: "No messages yet",
                    timestamp: new Date(chatEntry.created_at),
                  },
              lastMessageTime: lastMessageData
                ? new Date(lastMessageData.created_at)
                : new Date(chatEntry.created_at),
              lastMessageStatus:
                (lastMessageData?.status as MessageType["status"]) || "sent",
              unreadCount: 0,
              participants: participantDisplayNames,
            } as Chat;
          });

          const resolvedFormattedChats = (
            await Promise.all(formattedChatsPromises)
          ).filter(Boolean) as Chat[];

          resolvedFormattedChats.sort(
            (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );

          setUserChats(resolvedFormattedChats);
          setFilteredChats(resolvedFormattedChats);
        } catch (error) {
          console.error("Error fetching user chats: raw error object:", error);
          try {
            console.error(
              "Error fetching user chats (JSON.stringified):",
              JSON.stringify(error, null, 2)
            );
          } catch (stringifyError) {
            console.error(
              "Could not stringify the error object due to:",
              stringifyError
            );
          }

          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error name:", error.name);
            console.error("Error stack:", error.stack);
          } else {
            console.error("Caught a non-Error object. Type:", typeof error);
            console.error("String representation:", String(error));
            console.error("Keys of error object:", Object.keys(error || {}));

            if (typeof error === "object" && error !== null) {
              for (const key in error) {
                if (Object.prototype.hasOwnProperty.call(error, key)) {
                  // @ts-ignore
                  console.log(`Error object property - ${key}:`, error[key]);
                }
              }
            }
          }
          setUserChats([]);
          setFilteredChats([]);
        } finally {
          setIsLoadingChats(false);
        }
      };
      fetchUserChats();
    } else if (!authLoading && !user) {
      setUserChats([]);
      setFilteredChats([]);
      setIsLoadingChats(false);
    }
  }, [user, authLoading]);

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
      setFilteredChats(userChats);
    } else {
      const filtered = userChats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query.toLowerCase()) ||
          (chat.lastMessage?.text.toLowerCase().includes(query.toLowerCase()) ??
            false)
      );
      setFilteredChats(filtered);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChat || !user) {
      console.error("Cannot send message: No selected chat or user.");
      return;
    }

    const newMessage = {
      chat_id: selectedChat.id,
      sender_id: user.id,
      content: text,
      status: "sent",
    };

    try {
      console.log(
        `Sending message to ${selectedChat.name}: ${text}`,
        newMessage
      );
      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select();

      if (error) {
        console.error(
          "Error sending message:",
          error.message,
          error.details,
          error.hint,
          error.code
        );

        return;
      }

      if (data) {
        console.log("Message sent successfully:", data[0]);
      } else {
        console.warn("Message insert call succeeded but no data returned.");
      }
    } catch (error) {
      console.error("Exception while sending message:", error);
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (user && isLoadingChats) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading chats...</p>
      </div>
    );
  }

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
