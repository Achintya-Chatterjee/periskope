import { render, screen, fireEvent, within } from "@testing-library/react";
import Sidebar from "@/components/sidebar";
import type { Chat } from "@/lib/types";

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice",
    lastMessage: { text: "Hello", timestamp: new Date("2024-01-01T10:00:00Z") },
    avatar: "A",
    unreadCount: 0,
    tags: ["work"],
    lastMessageTime: new Date("2024-01-01T10:00:00Z"),
  },
  {
    id: "2",
    name: "Bob",
    lastMessage: {
      text: "Hi there",
      timestamp: new Date("2024-01-01T11:00:00Z"),
    },
    avatar: "B",
    unreadCount: 2,
    tags: ["friends"],
    lastMessageTime: new Date("2024-01-01T11:00:00Z"),
  },
  {
    id: "3",
    name: "Charlie",
    lastMessage: { text: "Hey", timestamp: new Date("2024-01-01T12:00:00Z") },
    avatar: "C",
    unreadCount: 0,
    tags: ["work", "urgent"],
    lastMessageTime: new Date("2024-01-01T12:00:00Z"),
  },
];

const mockAllAvailableTags = ["work", "friends", "urgent"];

const mockOnSelectChat = jest.fn();
const mockOnSearch = jest.fn();
const mockOnTagFilterChange = jest.fn();

const defaultProps = {
  chats: mockChats,
  selectedChat: null,
  onSelectChat: mockOnSelectChat,
  searchQuery: "",
  onSearch: mockOnSearch,
  allAvailableTags: mockAllAvailableTags,
  activeTagFilter: null,
  onTagFilterChange: mockOnTagFilterChange,
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the sidebar with initial elements", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Custom filter")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Filtered")).toBeInTheDocument();

    expect(screen.getAllByRole("button").length).toBeGreaterThan(5);
  });

  test("should display chat list items", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  test("should call onSelectChat when a chat item is clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByText("Alice"));
    expect(mockOnSelectChat).toHaveBeenCalledWith(mockChats[0]);
  });

  test("should display and update search query", () => {
    render(<Sidebar {...defaultProps} searchQuery="test query" />);
    const searchInput = screen.getByPlaceholderText(
      "Search"
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("test query");

    fireEvent.change(searchInput, { target: { value: "new query" } });
    expect(mockOnSearch).toHaveBeenCalledWith("new query");
  });

  test("should display available tags and handle tag filtering", () => {
    render(<Sidebar {...defaultProps} />);
    const tagsFilterArea = screen
      .getByText("All Chats")
      .closest("div.flex-wrap") as HTMLElement;
    expect(tagsFilterArea).toBeInTheDocument();

    expect(within(tagsFilterArea).getByText("All Chats")).toBeInTheDocument();
    mockAllAvailableTags.forEach((tag) => {
      expect(within(tagsFilterArea).getByText(tag)).toBeInTheDocument();
    });

    fireEvent.click(within(tagsFilterArea).getByText("work"));
    expect(mockOnTagFilterChange).toHaveBeenCalledWith("work");

    fireEvent.click(within(tagsFilterArea).getByText("All Chats"));
    expect(mockOnTagFilterChange).toHaveBeenCalledWith(null);
  });

  test("should highlight the active tag", () => {
    render(<Sidebar {...defaultProps} activeTagFilter="work" />);
    const tagsFilterArea = screen
      .getByText("All Chats")
      .closest("div.flex-wrap") as HTMLElement;
    const workTagButton = within(tagsFilterArea).getByText("work");
    expect(workTagButton).toHaveClass("bg-green-600", "text-white");

    const friendsTagButton = within(tagsFilterArea).getByText("friends");
    expect(friendsTagButton).not.toHaveClass("bg-green-600", "text-white");
    expect(friendsTagButton).toHaveClass("text-gray-700");
  });

  test("should highlight 'All Chats' when no filter is active", () => {
    render(<Sidebar {...defaultProps} activeTagFilter={null} />);
    const allChatsButton = screen.getByText("All Chats");
    expect(allChatsButton).toHaveClass("bg-green-600", "text-white");
  });

  test("should toggle 'Custom filter' button style on click", () => {
    render(<Sidebar {...defaultProps} />);
    const customFilterButton = screen.getByText("Custom filter");

    expect(customFilterButton).toHaveClass("text-green-600", "bg-transparent");
    expect(customFilterButton).not.toHaveClass("bg-green-600", "text-white");

    fireEvent.click(customFilterButton);

    expect(customFilterButton).toHaveClass("bg-green-600", "text-white");
    expect(customFilterButton).not.toHaveClass(
      "text-green-600",
      "bg-transparent"
    );

    fireEvent.click(customFilterButton);

    expect(customFilterButton).toHaveClass("text-green-600", "bg-transparent");
    expect(customFilterButton).not.toHaveClass("bg-green-600", "text-white");
  });

  test("should indicate selected chat", () => {
    render(<Sidebar {...defaultProps} selectedChat={mockChats[1]} />);

    const selectedChatItemContainer = screen
      .getByText("Bob")
      .closest("div.p-4.border-b");
    expect(selectedChatItemContainer).toHaveClass("bg-gray-50");

    const unselectedChatItemContainer = screen
      .getByText("Alice")
      .closest("div.p-4.border-b");
    expect(unselectedChatItemContainer).not.toHaveClass("bg-gray-50");
  });

  test("should not render tags filter area if allAvailableTags is empty", () => {
    render(<Sidebar {...defaultProps} allAvailableTags={[]} />);
    expect(screen.queryByTestId("tags-filter-area")).not.toBeInTheDocument();
  });
});
