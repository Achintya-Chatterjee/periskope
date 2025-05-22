import { render, screen, fireEvent } from "@testing-library/react";
import ChatContextHeader from "@/components/chat-context-header";
import type { Chat, Profile } from "@/lib/types";

const mockChatData = {
  messages: [],
  owner_id: "user1",
  is_group: true,
  lastMessageTime: new Date(),
  unreadCount: 0,
};

const mockChat: Chat & { participants: (Profile | string)[] } = {
  ...mockChatData,
  id: "chat1",
  name: "Test Chat",
  participants: [
    { id: "user1", full_name: "Alice", avatar_url: "/alice.jpg" },
    { id: "user2", full_name: "Bob" },
    { id: "user3", full_name: "Charlie", avatar_url: "/charlie.jpg" },
    { id: "user4", full_name: "David" },
  ],
};

const mockChatWithStringParticipants: Chat & {
  participants: (Profile | string)[];
} = {
  ...mockChatData,
  id: "chat2",
  name: "String Chat",
  participants: [
    { id: "user1", full_name: "user1" },
    { id: "user2", full_name: "user2" },
    { id: "user3", full_name: "user3" },
    { id: "user4", full_name: "user4" },
    { id: "user5", full_name: "user5" },
  ],
};

type ComponentChatType = Chat & { participants: (Profile | string)[] };

describe("ChatContextHeader", () => {
  it("should renders nothing when chat is null", () => {
    const { container } = render(
      <ChatContextHeader chat={null} onManageParticipantsClick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should renders chat name and participant string", () => {
    render(
      <ChatContextHeader
        chat={mockChat as ComponentChatType}
        onManageParticipantsClick={() => {}}
      />
    );
    expect(screen.getByText("Test Chat")).toBeInTheDocument();
    expect(screen.getByText("Alice, Bob, Charlie, David")).toBeInTheDocument();
  });

  it("should renders chat name when participant names are unknown", () => {
    const chatWithUnknowns: ComponentChatType = {
      ...mockChat,
      name: "Test Chat Unknown",
      participants: [{ id: "user1" }, { id: "user2" }],
    };
    render(
      <ChatContextHeader
        chat={chatWithUnknowns}
        onManageParticipantsClick={() => {}}
      />
    );
    expect(screen.getByText("Test Chat Unknown")).toBeInTheDocument();
    const participantContainer =
      screen.getByText("Test Chat Unknown").nextElementSibling;

    if (participantContainer) {
      expect(participantContainer.textContent?.trim()).toBe("");
    } else {
    }
  });

  it("should renders avatars and overflow indicator", () => {
    render(
      <ChatContextHeader
        chat={mockChat as ComponentChatType}
        onManageParticipantsClick={() => {}}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();

    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("should renders fallback avatars and overflow indicator for string participants", () => {
    render(
      <ChatContextHeader
        chat={mockChatWithStringParticipants as ComponentChatType}
        onManageParticipantsClick={() => {}}
      />
    );

    const fallbackAvatars = screen.getAllByText("U");
    expect(fallbackAvatars.length).toBe(3);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("should calls onManageParticipantsClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <ChatContextHeader
        chat={mockChat as ComponentChatType}
        onManageParticipantsClick={handleClick}
      />
    );
    fireEvent.click(screen.getByTitle("Manage Participants Test"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should renders default chat name if chat.name is null or undefined", () => {
    const chatWithoutName: ComponentChatType = {
      ...mockChatData,
      id: "chat3",
      name: null as any,
      participants: mockChat.participants,
    };
    render(
      <ChatContextHeader
        chat={chatWithoutName}
        onManageParticipantsClick={() => {}}
      />
    );
    expect(screen.getByText("Chat")).toBeInTheDocument();
  });

  it(" should correctly displays participant avatars and count with fewer than maxVisibleAvatars participants", () => {
    const chatWithTwoParticipants: ComponentChatType = {
      ...mockChat,
      name: "Two Person Chat",
      participants: [
        { id: "user1", full_name: "Alice", avatar_url: "/alice.jpg" },
        { id: "user2", full_name: "Bob" },
      ],
    };
    render(
      <ChatContextHeader
        chat={chatWithTwoParticipants}
        onManageParticipantsClick={() => {}}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText(/\+/)).toBeNull();
  });

  it("should handles participants with only id (string processed to Profile) correctly for avatar fallback", () => {
    const chatWithIdOnlyParticipants: ComponentChatType = {
      ...mockChat,
      name: "ID Only Chat",
      participants: [
        { id: "user1", full_name: "user1" },
        { id: "user2", full_name: "user2" },
      ],
    };
    render(
      <ChatContextHeader
        chat={chatWithIdOnlyParticipants}
        onManageParticipantsClick={() => {}}
      />
    );
    const fallbacks = screen.getAllByText("U");
    expect(fallbacks).toHaveLength(2);
    expect(screen.queryByText(/\+/)).toBeNull();
  });
});
