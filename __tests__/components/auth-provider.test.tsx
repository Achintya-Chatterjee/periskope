import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const TestConsumerComponent = () => {
  const auth = useAuth();
  if (auth.isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user-id">{auth.user?.id || "null"}</div>
      <div data-testid="session-token">
        {auth.session?.access_token || "null"}
      </div>
      <button onClick={auth.signOut}>Sign Out</button>
    </div>
  );
};

describe("AuthProvider", () => {
  let mockUseRouter: jest.Mock;
  let mockUsePathname: jest.Mock;
  let mockGetSession: jest.Mock;
  let mockOnAuthStateChange: jest.Mock;
  let mockSignOut: jest.Mock;
  let authStateChangeCallback: (
    event: string,
    session: Session | null
  ) => Promise<void>;

  beforeEach(() => {
    mockUseRouter = jest.fn(() => ({ push: jest.fn() }));
    (useRouter as jest.Mock).mockImplementation(mockUseRouter);

    mockUsePathname = jest.fn(() => "/");
    (usePathname as jest.Mock).mockImplementation(mockUsePathname);

    mockGetSession = jest.fn();
    (supabase.auth.getSession as jest.Mock).mockImplementation(mockGetSession);

    mockOnAuthStateChange = jest.fn((callback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation(
      mockOnAuthStateChange
    );

    mockSignOut = jest.fn(() => Promise.resolve({ error: null }));
    (supabase.auth.signOut as jest.Mock).mockImplementation(mockSignOut);

    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially and then reflect no session", async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("null");
      expect(screen.getByTestId("session-token")).toHaveTextContent("null");
    });
    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it("should load initial session and user data", async () => {
    const mockSession: Session = {
      access_token: "fake-access-token",
      refresh_token: "fake-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "user-123",
        aud: "authenticated",
        role: "authenticated",
        email: "test@example.com",
        created_at: new Date().toISOString(),
        app_metadata: { provider: "email" },
        user_metadata: { name: "Test User" },
      } as User,
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
      expect(screen.getByTestId("session-token")).toHaveTextContent(
        "fake-access-token"
      );
    });
  });

  it("should react to onAuthStateChange for SIGNED_IN event", async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toHaveTextContent("null")
    );

    const mockSessionSignedIn: Session = {
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "user-456",
        aud: "authenticated",
        role: "authenticated",
        email: "new@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User,
    };

    await act(async () => {
      await authStateChangeCallback("SIGNED_IN", mockSessionSignedIn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-456");
      expect(screen.getByTestId("session-token")).toHaveTextContent(
        "new-access-token"
      );
    });
  });

  it("should react to onAuthStateChange for SIGNED_OUT event", async () => {
    const initialSession: Session = {
      access_token: "initial-token",
      user: {
        id: "user-789",
        aud: "authenticated",
        role: "authenticated",
        email: "initial@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User,
      refresh_token: "initial-refresh",
      expires_in: 3600,
      token_type: "bearer",
    };
    mockGetSession.mockResolvedValue({ data: { session: initialSession } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-789")
    );

    await act(async () => {
      await authStateChangeCallback("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("null");
      expect(screen.getByTestId("session-token")).toHaveTextContent("null");
    });
  });

  it("should call supabase.auth.signOut and redirect on signOut call", async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({ push: pushMock }));

    const initialSession: Session = {
      access_token: "signout-token",
      user: {
        id: "user-signout",
        aud: "authenticated",
        role: "authenticated",
        email: "signout@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User,
      refresh_token: "signout-refresh",
      expires_in: 3600,
      token_type: "bearer",
    };
    mockGetSession.mockResolvedValue({ data: { session: initialSession } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-signout")
    );

    const signOutButton = screen.getByText("Sign Out");
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  it("should redirect to /login if no user and not on /login page", async () => {
    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUsePathname.mockReturnValue("/dashboard");
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  it("should redirect to / if user exists and on /login page", async () => {
    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUsePathname.mockReturnValue("/login");

    const mockSession: Session = {
      access_token: "redirect-token",
      user: {
        id: "user-redirect",
        aud: "authenticated",
        role: "authenticated",
        email: "redirect@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User,
      refresh_token: "redirect-refresh",
      expires_in: 3600,
      token_type: "bearer",
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("should not redirect if no user and on /login page", async () => {
    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUsePathname.mockReturnValue("/login");
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toHaveTextContent("null")
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should not redirect if user exists and not on /login page", async () => {
    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    mockUsePathname.mockReturnValue("/dashboard");

    const mockSession: Session = {
      access_token: "no-redirect-token",
      user: {
        id: "user-no-redirect",
        aud: "authenticated",
        role: "authenticated",
        email: "no-redirect@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User,
      refresh_token: "no-redirect-refresh",
      expires_in: 3600,
      token_type: "bearer",
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });

    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toHaveTextContent(
        "user-no-redirect"
      )
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should unsubscribe from onAuthStateChange on unmount", async () => {
    const unsubscribeMock = jest.fn();
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user-id")).toBeInTheDocument()
    );

    unmount();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("useAuth throws error if used outside of AuthProvider", () => {
    const originalError = console.error;
    console.error = jest.fn();

    let error: Error | undefined;
    const ErroneousComponent = () => {
      try {
        useAuth();
      } catch (e) {
        if (e instanceof Error) {
          error = e;
        }
      }
      return null;
    };
    render(<ErroneousComponent />);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      "useAuth must be used within an AuthProvider"
    );

    console.error = originalError;
  });
});
