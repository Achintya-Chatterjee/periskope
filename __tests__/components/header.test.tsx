import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/header";
import { useAuth } from "@/components/auth-provider";

jest.mock("@/components/auth-provider", () => ({
  useAuth: jest.fn(),
}));

const mockSignOut = jest.fn();

const mockUser = {
  id: "user123",
  email: "test@example.com",
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signOut: mockSignOut,
    });
  });

  test("should renders logo, title, and static buttons", () => {
    render(<Header selectedChat={null} />);

    expect(screen.getByText("P")).toBeInTheDocument();

    expect(
      screen.getByText("P").closest("span[class*='rounded-full']")
    ).toBeInTheDocument();

    expect(screen.getByText("chats")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /help/i })).toBeInTheDocument();
    expect(screen.getByText(/\d+ \/ \d+ phones/i)).toBeInTheDocument();
  });

  test("should renders all icon buttons with correct aria-labels", () => {
    render(<Header selectedChat={null} />);
    expect(screen.getByLabelText("Download desktop app")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle notifications")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle activity list")).toBeInTheDocument();
  });

  describe("User Authentication", () => {
    test("should shows Sign Out button when user is authenticated", () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        signOut: mockSignOut,
      });
      render(<Header selectedChat={null} />);
      expect(
        screen.getByRole("button", { name: "Sign Out" })
      ).toBeInTheDocument();
    });

    test("should does not show Sign Out button when user is not authenticated", () => {
      render(<Header selectedChat={null} />);
      expect(
        screen.queryByRole("button", { name: "Sign Out" })
      ).not.toBeInTheDocument();
    });

    test("should calls signOut when Sign Out button is clicked", () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        signOut: mockSignOut,
      });
      render(<Header selectedChat={null} />);
      const signOutButton = screen.getByRole("button", { name: "Sign Out" });
      fireEvent.click(signOutButton);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
