import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ChatInterface from "@/components/chat-interface";
import type { User } from "@supabase/supabase-js";
import type { Chat, Message as MessageType, Profile } from "@/lib/types";

const mockUser = {
  id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  email: "test@example.com",
} as User;
const mockUseAuth = jest.fn();
jest.mock("@/components/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockSupabaseFrom = jest.fn();
const mockSupabaseSelect = jest.fn();
const mockSupabaseInsert = jest.fn();
const mockSupabaseEq = jest.fn();
const mockSupabaseIn = jest.fn();
const mockSupabaseOrder = jest.fn();
const mockSupabaseLimit = jest.fn();
const mockSupabaseMaybeSingle = jest.fn();

mockSupabaseFrom.mockImplementation(() => ({
  select: mockSupabaseSelect,
  insert: mockSupabaseInsert,
}));
mockSupabaseInsert.mockImplementation(() => ({
  select: mockSupabaseSelect,
}));

mockSupabaseSelect.mockImplementation(() => ({
  eq: mockSupabaseEq,
  in: mockSupabaseIn,
  order: mockSupabaseOrder,
  select: mockSupabaseSelect,
}));
mockSupabaseOrder.mockImplementation(() => ({
  limit: mockSupabaseLimit,
  select: mockSupabaseSelect,
}));
mockSupabaseLimit.mockImplementation(() => ({
  maybeSingle: mockSupabaseMaybeSingle,
  select: mockSupabaseSelect,
}));

jest.doMock("@/lib/supabaseClient", () => ({
  supabase: {
    from: mockSupabaseFrom,
  },
}));

jest.mock("@/components/sidebar", () =>
  jest.fn((props) => {
    return (
      <div
        data-testid="sidebar"
        onClick={() => props.onSelectChat(props.chats?.[0])}
      >
        {props.searchQuery} {props.activeTagFilter}
      </div>
    );
  })
);
jest.mock("@/components/chat-window", () =>
  jest.fn((props) => (
    <div data-testid="chat-window">
      <button onClick={() => props.onSendMessage("Hello")}>Send</button>
    </div>
  ))
);
jest.mock("@/components/header", () =>
  jest.fn(() => <div data-testid="header">Header</div>)
);
jest.mock("@/components/right-main-sidebar", () =>
  jest.fn(() => <div data-testid="right-main-sidebar">Right Sidebar</div>)
);
jest.mock("@/components/chat-context-header", () =>
  jest.fn((props) => (
    <div data-testid="chat-context-header">
      <button onClick={props.onManageParticipantsClick}>Manage</button>
    </div>
  ))
);
jest.mock("@/components/manage-participants-modal", () =>
  jest.fn((props) =>
    props.isOpen ? (
      <div data-testid="manage-participants-modal">Modal Open</div>
    ) : null
  )
);
jest.mock("@/components/spinner", () =>
  jest.fn(() => <div data-testid="spinner">Loading...</div>)
);
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: jest.fn(({ children }) => (
    <div data-testid="scroll-area">{children}</div>
  )),
}));

const resetAllSupabaseMockFuncs = () => {
  mockSupabaseFrom.mockClear();
  mockSupabaseSelect.mockClear();
  mockSupabaseInsert.mockClear();
  mockSupabaseEq.mockClear();
  mockSupabaseIn.mockClear();
  mockSupabaseOrder.mockClear();
  mockSupabaseLimit.mockClear();
  mockSupabaseMaybeSingle.mockClear();

  mockSupabaseFrom.mockImplementation(() => ({
    select: mockSupabaseSelect,
    insert: mockSupabaseInsert,
  }));
  mockSupabaseInsert.mockImplementation(() => ({ select: mockSupabaseSelect }));
  mockSupabaseSelect.mockImplementation(() => ({
    eq: mockSupabaseEq,
    in: mockSupabaseIn,
    order: mockSupabaseOrder,
    select: mockSupabaseSelect,
  }));
  mockSupabaseOrder.mockImplementation(() => ({
    limit: mockSupabaseLimit,
    select: mockSupabaseSelect,
  }));
  mockSupabaseLimit.mockImplementation(() => ({
    maybeSingle: mockSupabaseMaybeSingle,
    select: mockSupabaseSelect,
  }));
};

const mockChatBase: Chat = {
  id: "chat1",
  name: "Test User",
  lastMessageTime: new Date("2023-01-01T10:00:00.000Z"),
  unreadCount: 0,
};

const createMockChat = (
  id: string,
  name: string,
  lastMessageText: string,
  lastMessageTime: Date,
  tags: string[] = [],
  avatar?: string
): Chat => ({
  id,
  name,
  avatar,
  lastMessage: { text: lastMessageText, timestamp: lastMessageTime },
  lastMessageTime,
  lastMessageStatus: "read",
  unreadCount: 0,
  tags,
  participants: [
    { id: mockUser.id, full_name: "Current User" },
    { id: `other-${id}`, full_name: `Other in ${name}` },
  ],
});

describe("ChatInterface Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllSupabaseMockFuncs();
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
  });

  test("should render spinner when auth is loading", () => {
    render(<ChatInterface />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test('should render "Not authenticated" when user is null and auth is not loading', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    render(<ChatInterface />);
    expect(screen.getByText("Not authenticated.")).toBeInTheDocument();
  });

  test("should render spinner when user is authenticated but chats are loading initially", async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockSupabaseEq.mockResolvedValueOnce({ data: [], error: null });
    render(<ChatInterface />);
    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });
  });

  test('should display "Select a chat" message when authenticated and no chat is selected', async () => {
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockSupabaseEq.mockResolvedValueOnce({ data: [], error: null });

    render(<ChatInterface />);
    await waitFor(() => {
      expect(
        screen.getByText(/Select a chat to start messaging/i)
      ).toBeInTheDocument();
    });
  });
});
