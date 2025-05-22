"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, Chat } from "@/lib/types";

interface ManageParticipantsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  chat: Chat | null;
  currentUserId: string | undefined;
}

// Mock data - replace with actual fetching
const mockUsers: Profile[] = [
  // { id: "user1", full_name: "Alice Wonderland", avatar_url: null, email: "alice@example.com" },
  // { id: "user2", full_name: "Bob The Builder", avatar_url: null, email: "bob@example.com" },
  // { id: "user3", full_name: "Charlie Brown", avatar_url: null, email: "charlie@example.com" },
];

export default function ManageParticipantsModal({
  isOpen,
  onOpenChange,
  chat,
  currentUserId,
}: ManageParticipantsModalProps) {
  const [allUsers, setAllUsers] = useState<Profile[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentParticipantProfiles, currentParticipantIds } = useMemo(() => {
    const profiles: Profile[] = [];
    const ids: string[] = [];
    chat?.participants?.forEach((p) => {
      if (typeof p === "object" && p !== null && "id" in p) {
        profiles.push(p as Profile);
        ids.push((p as Profile).id);
      } else if (typeof p === "string") {
        ids.push(p);
      }
    });
    return { currentParticipantProfiles: profiles, currentParticipantIds: ids };
  }, [chat?.participants]);

  const availableUsersToAdd = allUsers.filter(
    (user) =>
      !currentParticipantIds.includes(user.id) && user.id !== currentUserId
  );

  const filteredAvailableUsers = availableUsersToAdd.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setAllUsers(data || []);
    } catch (err: any) {
      console.error("Error fetching all users:", err);
      setError("Failed to load users. " + err.message);
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddParticipant = async (userId: string) => {
    if (!chat || !chat.id) return;
    console.log(`Attempting to add user ${userId} to chat ${chat.id}`);
    try {
      const { error } = await supabase
        .from("chat_participants")
        .insert({ chat_id: chat.id, user_id: userId });
      if (error) throw error;

      onOpenChange(false);
    } catch (err: any) {
      console.error("Error adding participant:", err);
      setError("Failed to add participant. " + err.message);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!chat || !chat.id || userId === currentUserId) return;
    console.log(`Attempting to remove user ${userId} from chat ${chat.id}`);
    try {
      const { error } = await supabase
        .from("chat_participants")
        .delete()
        .match({ chat_id: chat.id, user_id: userId });
      if (error) throw error;

      onOpenChange(false);
    } catch (err: any) {
      console.error("Error removing participant:", err);
      setError("Failed to remove participant. " + err.message);
    }
  };

  if (!chat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white">
        <DialogHeader>
          <DialogTitle>Manage Participants</DialogTitle>
          <DialogDescription>
            Add or remove members from &quot;{chat.name || "this chat"}&quot;.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="grid gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              Current Participants
            </h3>
            {currentParticipantProfiles.length > 0 ? (
              <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                {currentParticipantProfiles.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-1 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={participant.avatar_url || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {participant.full_name
                            ?.substring(0, 1)
                            .toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">
                        {participant.full_name}
                      </span>
                    </div>
                    {participant.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveParticipant(participant.id)}
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-xs text-gray-500">
                No participants found (this shouldn't happen for an active
                chat).
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">
              Add New Participants
            </h3>
            <Input
              placeholder="Search users to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            {isLoading && (
              <p className="text-xs text-gray-500">Loading users...</p>
            )}
            <ScrollArea className="h-[150px] w-full rounded-md border p-2">
              {filteredAvailableUsers.length > 0 ? (
                filteredAvailableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-1 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {user.full_name?.substring(0, 1).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">
                        {user.full_name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-1.5 text-green-600 border-green-500 hover:bg-green-50"
                      onClick={() => handleAddParticipant(user.id)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">
                  {!isLoading &&
                    (searchTerm
                      ? "No users match your search."
                      : "No new users available to add.")}
                </p>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
