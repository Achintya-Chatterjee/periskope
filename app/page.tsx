"use client";

import ChatInterface from "@/components/chat-interface";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-100">
      {user && <ChatInterface />}
    </main>
  );
}
