"use client";

import ChatInterface from "@/components/chat-interface";
import { useAuth } from "@/components/auth-provider";
import Spinner from "@/components/spinner";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="h-screen flex flex-col">
      {user ? (
        <ChatInterface />
      ) : (
        <p className="text-center p-4">Please log in to continue.</p>
      )}
    </main>
  );
}
