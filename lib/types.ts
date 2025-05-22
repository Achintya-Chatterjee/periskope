export interface Message {
  id?: string;
  chat_id?: string;
  text: string;
  sender_id: string;
  created_at: string;
  timestamp?: Date;
  status?: "sent" | "delivered" | "read";
  attachment_url?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: {
    text: string;
    timestamp: Date;
  };
  lastMessageTime: Date;
  lastMessageStatus?: "sent" | "delivered" | "read";
  unreadCount: number;
  tags?: string[];
  phone?: string;
  phoneExt?: string;
  participants?: Profile[];
  messages?: Message[];
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}
