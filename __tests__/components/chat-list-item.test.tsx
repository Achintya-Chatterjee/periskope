import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ChatListItem from "@/components/chat-list-item";
import type { Chat } from "@/lib/types";

jest.mock("@radix-ui/react-avatar", () => {
  const AvatarPrimitive = jest.requireActual("@radix-ui/react-avatar");
  return {
    ...AvatarPrimitive,
    Root: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div data-testid="avatar-root" {...props} ref={ref}>
        {children}
      </div>
    )),
    Image: React.forwardRef(({ src, alt, ...props }: any, ref: any) =>
      src ? (
        <img
          data-testid="avatar-image"
          src={src}
          alt={alt}
          {...props}
          ref={ref}
        />
      ) : null
    ),
    Fallback: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <div data-testid="avatar-fallback" {...props} ref={ref}>
        {children}
      </div>
    )),
  };
});

jest.mock("@/components/ui/badge", () => ({
  Badge: jest.fn(({ children, className, ...props }) => (
    <div data-testid="badge" className={className} {...props}>
      {children}
    </div>
  )),
}));

jest.mock("react-icons/bs", () => ({
  BsCheck: jest.fn(() => <svg data-testid="bs-check-icon" />),
  BsCheckAll: jest.fn(() => <svg data-testid="bs-check-all-icon" />),
  BsTelephone: jest.fn(() => <svg data-testid="bs-telephone-icon" />),
}));

jest.mock("@/lib/utils", () => ({
  formatChatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
  cn: jest.fn((...inputs) =>
    inputs
      .flat(Infinity)
      .map((input) => {
        if (
          typeof input === "object" &&
          input !== null &&
          !Array.isArray(input)
        ) {
          return Object.entries(input)
            .filter(([_key, value]) => Boolean(value))
            .map(([key, _value]) => key)
            .join(" ");
        }
        return String(input);
      })
      .filter(
        (input) =>
          input &&
          input !== "null" &&
          input !== "undefined" &&
          input.trim() !== ""
      )
      .join(" ")
  ),
}));

const mockChatBase: Chat = {
  id: "chat1",
  name: "Test User",
  lastMessageTime: new Date("2023-01-01T10:00:00.000Z"),
  unreadCount: 0,
};

describe("ChatListItem Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    chat: mockChatBase,
    isSelected: false,
    onClick: mockOnClick,
  };

  test("should render basic chat information", () => {
    render(<ChatListItem {...defaultProps} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date(mockChatBase.lastMessageTime).toLocaleDateString()
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  test("should call onClick when clicked", () => {
    render(<ChatListItem {...defaultProps} />);
    fireEvent.click(screen.getByText("Test User"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("should apply selected styles when isSelected is true", () => {
    const { container } = render(
      <ChatListItem {...defaultProps} isSelected={true} />
    );

    expect(container.firstChild).toHaveClass("bg-gray-50");
  });

  test("should display avatar image if chat.avatar is provided", () => {
    const chatWithAvatar = {
      ...mockChatBase,
      avatar: "http://example.com/avatar.jpg",
    };
    render(<ChatListItem {...defaultProps} chat={chatWithAvatar} />);
    const avatarImage = screen.getByTestId("avatar-image");
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("src", "http://example.com/avatar.jpg");
    expect(avatarImage).toHaveAttribute("alt", "Test User");
    expect(screen.queryByTestId("avatar-fallback")).not.toBeInTheDocument();
  });

  test("should display fallback avatar if chat.avatar is an invalid/placeholder string", () => {
    const chatWithPlaceholder = {
      ...mockChatBase,
      avatar: "/placeholder.svg",
    };
    render(<ChatListItem {...defaultProps} chat={chatWithPlaceholder} />);
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-image")).not.toBeInTheDocument();
  });

  test("should display fallback avatar if chat.avatar is undefined", () => {
    const chatWithUndefinedAvatar = { ...mockChatBase, avatar: undefined };
    render(<ChatListItem {...defaultProps} chat={chatWithUndefinedAvatar} />);
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-image")).not.toBeInTheDocument();
  });

  test("should display last message text and status icons", () => {
    const chatWithMessage = {
      ...mockChatBase,
      lastMessage: { text: "Hello there", timestamp: new Date() },
      lastMessageStatus: "read" as "read" | "delivered" | "sent",
    };
    render(<ChatListItem {...defaultProps} chat={chatWithMessage} />);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
    expect(screen.getByTestId("bs-check-all-icon")).toBeInTheDocument();

    const chatWithMessageDelivered = {
      ...chatWithMessage,
      lastMessageStatus: "delivered" as "read" | "delivered" | "sent",
    };
    render(<ChatListItem {...defaultProps} chat={chatWithMessageDelivered} />);
    expect(screen.getByTestId("bs-check-icon")).toBeInTheDocument();
  });

  test("should display phone number and extension if available", () => {
    const chatWithPhone = {
      ...mockChatBase,
      phone: "123-456-7890",
      phoneExt: "123",
    };
    render(<ChatListItem {...defaultProps} chat={chatWithPhone} />);
    expect(screen.getByTestId("bs-telephone-icon")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("+123")).toBeInTheDocument();
  });

  test("should display phone number without extension if extension is not available", () => {
    const chatWithPhoneNoExt = { ...mockChatBase, phone: "987-654-3210" };
    render(<ChatListItem {...defaultProps} chat={chatWithPhoneNoExt} />);
    expect(screen.getByTestId("bs-telephone-icon")).toBeInTheDocument();
    expect(screen.getByText("987-654-3210")).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  test("should display tags with correct styling", () => {
    const chatWithTags = {
      ...mockChatBase,
      tags: ["Demo", "Internal", "Signup", "Content", "Dont Send", "Other"],
    };
    render(<ChatListItem {...defaultProps} chat={chatWithTags} />);

    const badges = screen.getAllByTestId("badge");
    expect(badges.length).toBe(6 + (chatWithTags.unreadCount > 0 ? 1 : 0));

    expect(
      screen.getByText("Demo").closest('[data-testid="badge"]')
    ).toHaveClass("border-orange-300");
    expect(
      screen.getByText("Internal").closest('[data-testid="badge"]')
    ).toHaveClass("border-green-300");
    expect(
      screen.getByText("Signup").closest('[data-testid="badge"]')
    ).toHaveClass("border-green-300");
    expect(
      screen.getByText("Content").closest('[data-testid="badge"]')
    ).toHaveClass("border-green-300");
    expect(
      screen.getByText("Dont Send").closest('[data-testid="badge"]')
    ).toHaveClass("border-red-300");
    expect(
      screen.getByText("Other").closest('[data-testid="badge"]')
    ).toHaveClass("border-gray-300");
  });

  test("should display unread count badge if unreadCount > 0", () => {
    const chatWithUnread = { ...mockChatBase, unreadCount: 5 };
    render(<ChatListItem {...defaultProps} chat={chatWithUnread} />);
    const unreadBadge = screen.getByText("5").closest('[data-testid="badge"]');
    expect(unreadBadge).toBeInTheDocument();
    expect(unreadBadge).toHaveClass("bg-green-600");
  });

  test("should not display unread count badge if unreadCount is 0", () => {
    render(
      <ChatListItem
        {...defaultProps}
        chat={{ ...mockChatBase, unreadCount: 0 }}
      />
    );

    const badges = screen.queryAllByTestId("badge");
    const unreadBadgeExists = badges.some(
      (badge) =>
        /^\d+$/.test(badge.textContent || "") &&
        badge.classList.contains("bg-green-600")
    );
    expect(unreadBadgeExists).toBe(false);
  });
});
