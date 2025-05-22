# Periskope Chat Application

This is a real-time chat application built as a take-home assignment for a Full-Stack Developer (SDE-1) role. It features user authentication, real-time messaging, and a responsive user interface.

## Features

*   **User Authentication:**
    *   Sign-up with email and password.
    *   Sign-in for existing users.
    *   Secure session management.
    *   Automatic creation of a user profile in the database upon sign-up.
*   **Real-time Chat:**
    *   View a list of your chats.
    *   Open a chat to view the conversation history.
    *   Send messages that are stored in the database.
    *   Receive messages from other users in real-time without needing to refresh.
*   **Route Protection:**
    *   Unauthenticated users are redirected to the `/login` page.
    *   Authenticated users attempting to access `/login` are redirected to the main chat interface (`/`).
*   **Pixel-Perfect UI:** UI designed to match provided specifications (based on the assignment requirements).

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (v15+ with App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/) for styling
    *   [shadcn/ui](https://ui.shadcn.com/) (likely, based on `components.json` - can be confirmed if used)
*   **Backend & Database:**
    *   [Supabase](https://supabase.io/)
        *   Authentication
        *   PostgreSQL Database
        *   Realtime Subscriptions
*   **Package Manager:**
    *   [pnpm](https://pnpm.io/)

## Prerequisites

*   Node.js (v18 or later recommended)
*   pnpm (or npm/yarn, though `pnpm-lock.yaml` is present)
*   A Supabase account and project.

## Getting Started

Follow these instructions to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd periskope
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root of the `periskope` directory and add your Supabase project URL and Anon Key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials. You can find these in your Supabase project settings under "API".

### 4. Supabase Setup

You need to run SQL scripts in your Supabase SQL Editor to set up the necessary tables, functions, triggers, and Row Level Security (RLS) policies.

**a. Database Schema & RLS:**

Execute the following SQL in your Supabase project's SQL Editor (under "Database"):

```sql
-- Create profiles table to store public user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profiles table
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Create chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_message_id UUID, -- Nullable, to be updated by a trigger or function later
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL -- user who initiated the chat
);

-- Trigger for chats table
CREATE TRIGGER on_chats_updated
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Create chat_participants table (junction table)
CREATE TABLE public.chat_participants (
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (chat_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Set to NULL if user profile is deleted
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- Add foreign key constraint for last_message_id in chats table
-- This must be done after messages table is created
ALTER TABLE public.chats
ADD CONSTRAINT fk_last_message
FOREIGN KEY (last_message_id)
REFERENCES public.messages(id) ON DELETE SET NULL;

-- Enable Row Level Security for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for chats
CREATE POLICY "Users can view chats they are a participant in."
  ON public.chats FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.chat_participants cp
    WHERE cp.chat_id = chats.id AND cp.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can create chats."
  ON public.chats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
  -- Additional check: created_by should be the logged-in user
  -- WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid()); -- Consider adding this if created_by is always auth.uid()

CREATE POLICY "Users can update chats they are a participant in (e.g., last_message_id)."
  ON public.chats FOR UPDATE
  USING (EXISTS (
    SELECT 1
    FROM public.chat_participants cp
    WHERE cp.chat_id = chats.id AND cp.user_id = auth.uid()
  ));

-- RLS Policies for chat_participants
CREATE POLICY "Users can view participants of chats they are in."
  ON public.chat_participants FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.chat_participants cp_self
    WHERE cp_self.chat_id = chat_participants.chat_id AND cp_self.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert themselves or be added to chats by participants (or a chat creator)."
  ON public.chat_participants FOR INSERT
  -- For simplicity, allowing any authenticated user to insert.
  -- A more restrictive policy might check if the user is adding themselves,
  -- or if an existing participant of the chat is adding them.
  WITH CHECK (auth.role() = 'authenticated');
  -- Example: Allow inserting self: WITH CHECK (user_id = auth.uid())
  -- Example: Allow chat creator to add:
  -- WITH CHECK (EXISTS (SELECT 1 FROM chats c WHERE c.id = chat_id AND c.created_by = auth.uid()) OR user_id = auth.uid())

-- RLS Policies for messages
CREATE POLICY "Users can view messages in chats they are a participant in."
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.chat_participants cp
    WHERE cp.chat_id = messages.chat_id AND cp.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages into chats they are a participant in."
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1
      FROM public.chat_participants cp
      WHERE cp.chat_id = messages.chat_id AND cp.user_id = auth.uid()
    )
  );

-- Function to handle new user sign-ups and create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) -- Assuming you want to store email, adjust if not
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on new auth.users entry
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**b. Enable Realtime:**

Execute the following SQL to enable realtime updates for `messages`, `chats`, and `chat_participants`:

```sql
-- Add tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;

-- Ensure RLS is enforced for realtime. This is usually default but good to be explicit.
-- Check your Supabase project settings under API > Realtime to ensure "Enable Realtime" is on
-- and "Enable Row Level Security" for Realtime is also checked.
```

### 5. Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

A brief overview of important directories:

*   `periskope/app/`: Contains the Next.js App Router pages.
    *   `app/layout.tsx`: Root layout, wraps the application with `AuthProvider`.
    *   `app/page.tsx`: Main page, displays the chat interface for authenticated users.
    *   `app/login/page.tsx`: Login and sign-up page.
*   `periskope/components/`: Reusable React components.
    *   `components/auth-provider.tsx`: Manages user authentication state and route protection.
    *   `components/chat-interface.tsx`: The main UI component for displaying chats and messages.
    *   `components/header.tsx`: Application header, includes the Sign Out button.
    *   `components/sidebar.tsx`: Displays the list of user's chats.
    *   `components/ui/`: UI components (likely from shadcn/ui).
*   `periskope/lib/`: Utility functions and type definitions.
    *   `lib/supabaseClient.ts`: Initializes the Supabase client.
    *   `lib/types.ts`: TypeScript type definitions for the application.
*   `periskope/public/`: Static assets.
*   `periskope/styles/`: Global styles.

## Key Components Explained

*   **`lib/supabaseClient.ts`**:
    This file initializes and exports the Supabase client instance using the environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This client is used throughout the application to interact with Supabase services (Auth, Database, Realtime).

*   **`components/auth-provider.tsx`**:
    This component is crucial for managing user authentication. It:
    *   Uses a React Context to provide user session data (`user`, `session`, `isLoading`) to its children.
    *   Subscribes to Supabase's `onAuthStateChange` to keep the session up-to-date.
    *   Implements route protection:
        *   Redirects unauthenticated users trying to access protected routes (like `/`) to `/login`.
        *   Redirects authenticated users trying to access `/login` to `/`.
    *   Provides `signIn`, `signUp`, and `signOut` functions.

*   **`app/login/page.tsx`**:
    Handles the user interface and logic for user sign-up and sign-in using the functions provided by `AuthProvider` (which internally call Supabase auth methods).

*   **`components/chat-interface.tsx`**:
    This is the heart of the chat functionality. It:
    *   Fetches the list of chats for the currently logged-in user.
    *   Displays these chats in a sidebar (likely using `components/sidebar.tsx`).
    *   Allows users to select a chat to view messages.
    *   Fetches messages for the selected chat.
    *   Provides an input to send new messages.
    *   Subscribes to Supabase Realtime for new messages in the active chat and updates to the chat list.

*   **Database Schema & RLS**:
    *   **`profiles`**: Stores public user data, linked to `auth.users`. Automatically populated on new user sign-up via a trigger.
    *   **`chats`**: Stores information about each chat conversation.
    *   **`chat_participants`**: A junction table linking users to chats.
    *   **`messages`**: Stores all messages, linked to a chat and a user.
    *   Row Level Security (RLS) policies are implemented for all tables to ensure users can only access and modify data they are permitted to (e.g., only see chats they are part of, only send messages in their chats).

## Testing

To test the application, including real-time message updates between different users:

1.  **Sign up with two different email addresses** to create two distinct user accounts.
2.  Open the application in two different browser windows or incognito tabs.
3.  Log in with one user account in one window and the other user account in the second window.
4.  Initiate a chat between these two users as if they are part of a common chat.
5.  Send messages from one user and observe them appearing in real-time for the other user.

**For submission/evaluation purposes, you can use the following pre-configured test accounts which should have some chat history:**

*   **User 1:**
    *   Email: `achintyachatterjee.jara@gmail.com`
    *   Password: `Bumba@1997`
*   **User 2:**
    *   Email: `bumba.jara@gmail.com`
    *   Password: `Bumba@1997`

It's recommended to log in with these accounts on separate browsers or incognito windows to test the real-time functionality effectively.