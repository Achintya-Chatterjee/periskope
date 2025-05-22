import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ChatWindow from "@/components/chat-window";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabaseClient";
import type { Chat, Message as MessageType, Profile } from "@/lib/types";

jest.mock("@/components/auth-provider", () => ({
  useAuth: jest.fn(),
}));
jest.mock("@/components/spinner", () => () => (
  <div data-testid="spinner">Loading...</div>
));
jest.mock("@/components/chat-message", () => (props: any) => (
  <div data-testid={`chat-message-${props.message.id}`}>
    <p>{props.message.text}</p>
    <span>Sender: {props.senderFullName || "Unknown"}</span>
    <span>{props.isCurrentUser ? " (You)" : " (Them)"}</span>
  </div>
));

jest.mock("@/lib/supabaseClient");

const mockSelectFn = jest.fn();
const mockEqFn = jest.fn();
const mockOrderFn = jest.fn();
const mockReturnsFn = jest.fn();
const mockOnFn = jest.fn();
const mockSubscribeFn = jest.fn();

Element.prototype.scrollIntoView = jest.fn();

const mockCurrentUser: Profile = {
  id: "user-current",
  full_name: "Current User",
  avatar_url: "current_user.jpg",
  email: "current@test.com",
  updated_at: new Date().toISOString(),
};

const mockOtherUser: Profile = {
  id: "user-other",
  full_name: "Other User",
  avatar_url: "other_user.jpg",
  email: "other@test.com",
  updated_at: new Date().toISOString(),
};

const mockChatData: Chat = {
  id: "chat1",
  name: "Test Chat",
  participants: [mockCurrentUser, mockOtherUser],
  lastMessage: { text: "Hello", timestamp: new Date() },
  lastMessageTime: new Date(),
  unreadCount: 0,
  avatar: "chat_avatar.jpg",
};

const mockMessagesRaw: any[] = [
  {
    id: "msg1",
    chat_id: "chat1",
    content: "Hello there!",
    sender_id: "user-other",
    created_at: new Date(Date.now() - 10000).toISOString(),
    status: "delivered",
  },
  {
    id: "msg2",
    chat_id: "chat1",
    content: "Hi!",
    sender_id: "user-current",
    created_at: new Date().toISOString(),
    status: "read",
  },
];

const mockParticipantsData = [
  {
    user_id: mockCurrentUser.id,
    profiles: {
      id: mockCurrentUser.id,
      full_name: mockCurrentUser.full_name,
      avatar_url: mockCurrentUser.avatar_url,
    },
  },
  {
    user_id: mockOtherUser.id,
    profiles: {
      id: mockOtherUser.id,
      full_name: mockOtherUser.full_name,
      avatar_url: mockOtherUser.avatar_url,
    },
  },
];

const mockOnSendMessage = jest.fn();

describe("ChatWindow Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({ user: mockCurrentUser });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: mockSelectFn,
    }));
    mockSelectFn.mockImplementation(() => ({
      eq: mockEqFn,
    }));
    mockEqFn.mockImplementation((_column, _value) => {
      const selectArgs =
        mockSelectFn.mock.calls[mockSelectFn.mock.calls.length - 1][0];
      if (selectArgs === "user_id, profiles(id, full_name, avatar_url)") {
        return { returns: mockReturnsFn };
      }
      return { order: mockOrderFn };
    });

    mockOrderFn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: mockMessagesRaw, error: null }), 10)
        )
    );
    mockReturnsFn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ data: mockParticipantsData, error: null }),
            10
          )
        )
    );

    (supabase.channel as jest.Mock).mockImplementation(() => ({
      on: mockOnFn,
      subscribe: mockSubscribeFn,
    }));
    mockOnFn.mockReturnThis();
    mockSubscribeFn.mockImplementation((callback) => {
      Promise.resolve().then(() => callback("SUBSCRIBED"));
      return {
        unsubscribe: jest.fn(),
      };
    });
  });

  test("should show spinner while loading messages and then display messages", async () => {
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );

    expect(screen.getByText("Hello there!")).toBeInTheDocument();
    expect(screen.getByTestId("chat-message-msg1")).toHaveTextContent(
      "Sender: Other User"
    );
    expect(screen.getByTestId("chat-message-msg1")).toHaveTextContent("(Them)");

    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(screen.getByTestId("chat-message-msg2")).toHaveTextContent(
      "Sender: Current User"
    );
    expect(screen.getByTestId("chat-message-msg2")).toHaveTextContent("(You)");

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  test("should display error if fetching messages fails", async () => {
    mockOrderFn.mockResolvedValueOnce({
      data: null,
      error: { message: "Failed to fetch messages" },
    });
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );

    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );
    expect(screen.queryByText("Hello there!")).not.toBeInTheDocument();
  });

  test("should allow typing and sending a message via button click", async () => {
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText("Message...");
    const sendButton = screen.getByLabelText("Send message");

    fireEvent.change(input, { target: { value: "Test message" } });
    expect(input).toHaveValue("Test message");

    fireEvent.click(sendButton);
    expect(mockOnSendMessage).toHaveBeenCalledWith("Test message");
    expect(input).toHaveValue("");
  });

  test("should allow sending a message via Enter key", async () => {
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText("Message...");
    fireEvent.change(input, { target: { value: "Enter key test" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockOnSendMessage).toHaveBeenCalledWith("Enter key test");
    expect(input).toHaveValue("");
  });

  test("should not send message if text is empty or only whitespace", async () => {
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText("Message...");
    const sendButton = screen.getByLabelText("Send message");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(input).toHaveValue("   ");
  });

  test("should display newly received real-time messages", async () => {
    (Element.prototype.scrollIntoView as jest.Mock).mockClear();
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    await waitFor(
      () => expect(screen.queryByTestId("spinner")).not.toBeInTheDocument(),
      { timeout: 200 }
    );

    expect(screen.getByText("Hello there!")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);

    const newMessagePayload = {
      new: {
        id: "msg3-realtime",
        chat_id: "chat1",
        content: "Real-time message!",
        sender_id: "user-other",
        created_at: new Date().toISOString(),
        status: "delivered",
      },
    };

    const postgresChangesOnCall = mockOnFn.mock.calls.find(
      (call) => call[0] === "postgres_changes"
    );
    expect(postgresChangesOnCall).toBeDefined();

    const actualRealtimeCallback = postgresChangesOnCall?.[2];
    expect(actualRealtimeCallback).toBeInstanceOf(Function);

    if (actualRealtimeCallback) {
      act(() => {
        (actualRealtimeCallback as Function)(newMessagePayload);
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Real-time message!")).toBeInTheDocument();
    });
    expect(screen.getByTestId("chat-message-msg3-realtime")).toHaveTextContent(
      "Sender: Other User"
    );
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  test("should render all footer action buttons with aria-labels", async () => {
    render(
      <ChatWindow chat={mockChatData} onSendMessage={mockOnSendMessage} />
    );
    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );

    expect(screen.getByLabelText("Attach file")).toBeInTheDocument();
    expect(screen.getByLabelText("Add emoji")).toBeInTheDocument();
    expect(screen.getByLabelText("Schedule message")).toBeInTheDocument();
    expect(screen.getByLabelText("Message history")).toBeInTheDocument();
    expect(screen.getByLabelText("AI features")).toBeInTheDocument();
    expect(screen.getByLabelText("Templates")).toBeInTheDocument();
    expect(screen.getByLabelText("Record voice message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Periskope/i })
    ).toBeInTheDocument();
  });
});
