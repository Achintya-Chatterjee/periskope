import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import ManageParticipantsModal from "@/components/manage-participants-modal";
import type { Chat, Profile } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

jest.mock("@/lib/supabaseClient");

const mockSelectFn = jest.fn();
const mockInsertFn = jest.fn();
const mockDeleteFn = jest.fn();
const mockMatchFn = jest.fn();

const mockCurrentUserId = "user-current";

const mockUser1: Profile = {
  id: "user1",
  full_name: "Alice Wonderland",
  avatar_url: undefined,
  email: "alice@example.com",
  updated_at: undefined,
};
const mockUser2: Profile = {
  id: "user2",
  full_name: "Bob The Builder",
  avatar_url: undefined,
  email: "bob@example.com",
  updated_at: undefined,
};
const mockUser3: Profile = {
  id: "user3",
  full_name: "Charlie Brown",
  avatar_url: undefined,
  email: "charlie@example.com",
  updated_at: undefined,
};
const mockCurrentUserProfile: Profile = {
  id: mockCurrentUserId,
  full_name: "Current User",
  avatar_url: undefined,
  email: "current@example.com",
  updated_at: undefined,
};

const mockAllUsers: Profile[] = [
  mockUser1,
  mockUser2,
  mockUser3,
  mockCurrentUserProfile,
];

const mockChat: Chat = {
  id: "chat1",
  name: "Test Chat",
  participants: [mockUser1, mockCurrentUserProfile],
  lastMessage: { text: "Hello", timestamp: new Date() },
  lastMessageTime: new Date(),
  unreadCount: 0,
  avatar: undefined,
  lastMessageStatus: "read",
  tags: ["testtag"],
  phone: undefined,
  phoneExt: undefined,
  messages: [],
};

const onOpenChangeMock = jest.fn();

const defaultProps = {
  isOpen: true,
  onOpenChange: onOpenChangeMock,
  chat: mockChat,
  currentUserId: mockCurrentUserId,
};

describe("ManageParticipantsModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelectFn,
      insert: mockInsertFn,
      delete: mockDeleteFn,
    });
    mockDeleteFn.mockReturnValue({
      match: mockMatchFn,
    });

    mockSelectFn.mockResolvedValue({ data: mockAllUsers, error: null });
    mockInsertFn.mockResolvedValue({ error: null });
    mockMatchFn.mockResolvedValue({ error: null });
  });

  test("should not render if chat is null", () => {
    render(<ManageParticipantsModal {...defaultProps} chat={null} />);
    expect(screen.queryByText("Manage Participants")).not.toBeInTheDocument();
  });

  test("should render the modal with title and description when open", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    expect(screen.getByText("Manage Participants")).toBeInTheDocument();
    expect(
      screen.getByText(`Add or remove members from "${mockChat.name}".`)
    ).toBeInTheDocument();
    await screen.findByText("Bob The Builder");
  });

  test("should display current participants and hide remove button for current user", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Alice Wonderland");
    expect(screen.getByText("Current User")).toBeInTheDocument();

    const aliceRow = screen
      .getByText("Alice Wonderland")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    expect(within(aliceRow).getByText("Remove")).toBeInTheDocument();

    const currentUserRow = screen
      .getByText("Current User")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    expect(
      within(currentUserRow).queryByText("Remove")
    ).not.toBeInTheDocument();
  });

  test("should fetch and display users available to add", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(mockSelectFn).toHaveBeenCalled();

    const addNewSection = await screen.findByText("Add New Participants");
    const addNewList = addNewSection.parentElement?.querySelector(
      "div[class*='rounded-md border p-2']"
    ) as HTMLElement;

    expect(within(addNewList).getByText("Bob The Builder")).toBeInTheDocument();
    expect(within(addNewList).getByText("Charlie Brown")).toBeInTheDocument();
    expect(
      within(addNewList).queryByText("Alice Wonderland")
    ).not.toBeInTheDocument();
    expect(
      within(addNewList).queryByText("Current User")
    ).not.toBeInTheDocument();
  });

  test("should filter available users based on search term", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Add New Participants");

    const searchInput = screen.getByPlaceholderText("Search users to add...");
    fireEvent.change(searchInput, { target: { value: "Bob" } });

    await screen.findByText("Bob The Builder");
    expect(screen.getByText("Bob The Builder")).toBeInTheDocument();
    expect(screen.queryByText("Charlie Brown")).not.toBeInTheDocument();
  });

  test("should display 'No users match your search.' when search yields no results", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Add New Participants");
    const searchInput = screen.getByPlaceholderText("Search users to add...");
    fireEvent.change(searchInput, { target: { value: "NonExistentUser" } });
    await screen.findByText("No users match your search.");
    expect(screen.getByText("No users match your search.")).toBeInTheDocument();
  });

  test("should handle adding a participant", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Bob The Builder");

    const bobRow = screen
      .getByText("Bob The Builder")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    const addButton = within(bobRow).getByText("Add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("chat_participants");
      expect(mockInsertFn).toHaveBeenCalledWith({
        chat_id: mockChat.id,
        user_id: mockUser2.id,
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("should handle removing a participant", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Alice Wonderland");

    const aliceRow = screen
      .getByText("Alice Wonderland")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    const removeButton = within(aliceRow).getByText("Remove");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("chat_participants");
      expect(mockDeleteFn).toHaveBeenCalled();
      expect(mockMatchFn).toHaveBeenCalledWith({
        chat_id: mockChat.id,
        user_id: mockUser1.id,
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  test("should display error message if fetching users fails", async () => {
    mockSelectFn.mockResolvedValueOnce({
      data: null,
      error: { message: "Fetch failed" },
    });
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Failed to load users. Fetch failed");
    expect(
      screen.getByText("Failed to load users. Fetch failed")
    ).toBeInTheDocument();
  });

  test("should display error message if adding participant fails", async () => {
    mockInsertFn.mockResolvedValueOnce({
      error: { message: "Add failed" },
    });
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Bob The Builder");
    const bobRow = screen
      .getByText("Bob The Builder")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    fireEvent.click(within(bobRow).getByText("Add"));
    await screen.findByText("Failed to add participant. Add failed");
    expect(
      screen.getByText("Failed to add participant. Add failed")
    ).toBeInTheDocument();
  });

  test("should display error message if removing participant fails", async () => {
    mockMatchFn.mockResolvedValueOnce({
      error: { message: "Remove failed" },
    });
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Alice Wonderland");
    const aliceRow = screen
      .getByText("Alice Wonderland")
      .closest("div.flex.items-center.justify-between") as HTMLElement;
    fireEvent.click(within(aliceRow).getByText("Remove"));
    await screen.findByText("Failed to remove participant. Remove failed");
    expect(
      screen.getByText("Failed to remove participant. Remove failed")
    ).toBeInTheDocument();
  });

  test("should call onOpenChange with false when Close button is clicked", async () => {
    render(<ManageParticipantsModal {...defaultProps} />);
    await screen.findByText("Manage Participants");
    const dialog = screen.getByRole("dialog");

    const allCloseButtons = within(dialog).getAllByRole("button", {
      name: "Close",
    });

    const footerCloseButton = allCloseButtons.find(
      (button) => !button.querySelector("svg")
    );

    if (!footerCloseButton) {
      throw new Error(
        "Could not find the footer Close button. Check selectors and component structure."
      );
    }

    fireEvent.click(footerCloseButton);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
