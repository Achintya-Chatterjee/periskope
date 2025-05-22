import React from "react";
import { render, screen } from "@testing-library/react";
import ChatMessage from "@/components/chat-message";
import type { Message } from "@/lib/types";
import { BsCheckAll } from "react-icons/bs";

jest.mock("@radix-ui/react-avatar", () => {
  const AvatarPrimitive = jest.requireActual("@radix-ui/react-avatar");
  return {
    ...AvatarPrimitive,
    Root: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <span {...props} ref={ref}>
        {children}
      </span>
    )),
    Image: React.forwardRef(({ src, alt, ...props }: any, ref: any) =>
      src ? <img src={src} alt={alt} {...props} ref={ref} /> : null
    ),
    Fallback: React.forwardRef(({ children, ...props }: any, ref: any) => (
      <span {...props} ref={ref}>
        {children}
      </span>
    )),
  };
});

jest.mock("react-icons/bs", () => ({
  BsCheckAll: jest.fn(() => <svg data-testid="bs-check-all-icon" />),
}));

jest.mock("@/lib/utils", () => ({
  formatMessageTime: jest.fn((date) => new Date(date).toLocaleTimeString()),
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

const mockMessageBase: Message = {
  id: "msg1",
  chat_id: "chat1",
  text: "Hello World",
  timestamp: new Date("2023-01-01T10:00:00.000Z"),
  created_at: new Date("2023-01-01T10:00:00.000Z").toISOString(),
  sender_id: "user1",
  status: "read",
};

describe("ChatMessage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    message: mockMessageBase,
    isCurrentUser: false,
    senderFullName: "Other User",
    senderAvatarUrl: "http://example.com/avatar.jpg",
  };

  test("should render message from other user correctly", () => {
    render(<ChatMessage {...defaultProps} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText("Other User")).toBeInTheDocument();
    expect(screen.getByAltText("Other User")).toHaveAttribute(
      "src",
      "http://example.com/avatar.jpg"
    );
    expect(
      screen.getByText(
        new Date(mockMessageBase.timestamp!).toLocaleTimeString()
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hello World").closest(".items-end.gap-2")
    ).toHaveClass("justify-start");
  });

  test("should render message from current user correctly", () => {
    render(
      <ChatMessage
        {...defaultProps}
        isCurrentUser={true}
        senderFullName="Current User"
      />
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByText("Current User")).not.toBeInTheDocument();
    expect(screen.getByAltText("Current User")).toHaveAttribute(
      "src",
      "http://example.com/avatar.jpg"
    );
    expect(
      screen.getByText(
        new Date(mockMessageBase.timestamp!).toLocaleTimeString()
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hello World").closest(".items-end.gap-2")
    ).toHaveClass("justify-end");
  });

  test("should display fallback avatar and default name when sender info is missing for other user", () => {
    render(
      <ChatMessage
        {...defaultProps}
        senderFullName={null}
        senderAvatarUrl={null}
      />
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByText("Other User")).not.toBeInTheDocument();

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  test("should display formatted timestamp", () => {
    const testTimestamp = new Date("2023-10-26T14:35:00.000Z");
    const messageWithSpecificTimestamp = {
      ...mockMessageBase,
      timestamp: testTimestamp,
    };
    render(
      <ChatMessage {...defaultProps} message={messageWithSpecificTimestamp} />
    );
    expect(
      screen.getByText(testTimestamp.toLocaleTimeString())
    ).toBeInTheDocument();
    expect(require("@/lib/utils").formatMessageTime).toHaveBeenCalledWith(
      testTimestamp
    );
  });

  test("should display read status icon for current user's read message", () => {
    render(
      <ChatMessage
        {...defaultProps}
        isCurrentUser={true}
        message={{ ...mockMessageBase, status: "read" }}
      />
    );
    expect(screen.getByTestId("bs-check-all-icon")).toBeInTheDocument();

    expect(
      screen.getByTestId("bs-check-all-icon").parentElement
    ).not.toHaveClass("opacity-50");
  });

  test("should display sent status icon for current user's sent message", () => {
    render(
      <ChatMessage
        {...defaultProps}
        isCurrentUser={true}
        message={{ ...mockMessageBase, status: "sent" }}
      />
    );
    const icon = screen.getByTestId("bs-check-all-icon");
    expect(icon).toBeInTheDocument();

    expect(BsCheckAll).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining("opacity-50"),
      }),
      undefined
    );
  });

  test("should not display status icon for other user's message", () => {
    render(
      <ChatMessage
        {...defaultProps}
        message={{ ...mockMessageBase, status: "read" }}
      />
    );
    expect(screen.queryByTestId("bs-check-all-icon")).not.toBeInTheDocument();
  });

  test("should use default timestamp if message.timestamp is undefined", () => {
    const messageWithoutTimestamp = {
      ...mockMessageBase,
      timestamp: undefined,
    };

    const beforeRenderTime = new Date();
    render(<ChatMessage {...defaultProps} message={messageWithoutTimestamp} />);

    const formatMessageTimeMock = require("@/lib/utils").formatMessageTime;
    expect(formatMessageTimeMock).toHaveBeenCalled();
    const calledDate = (formatMessageTimeMock as jest.Mock).mock
      .calls[0][0] as Date;
    expect(calledDate).toBeInstanceOf(Date);

    expect(
      Math.abs(calledDate.getTime() - beforeRenderTime.getTime())
    ).toBeLessThan(5000);
  });
});
