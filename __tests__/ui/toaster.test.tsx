import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import type { ToastActionElement } from "@/components/ui/toast";

jest.mock("@/hooks/use-toast");

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="x-icon" {...props} />
  ),
}));

const mockUseToast = useToast as jest.Mock;

describe("Toaster Component", () => {
  beforeEach(() => {
    mockUseToast.mockReturnValue({ toasts: [] });
  });

  it("should render ToastProvider and ToastViewport", () => {
    render(<Toaster />);
    const viewport = screen.getByRole("list");
    expect(viewport).toBeInTheDocument();
  });

  it("should render no toasts when useToast returns an empty array", () => {
    render(<Toaster />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("should render a single toast with title and description", () => {
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: "1",
          title: "Test Toast Title",
          description: "Test Toast Description",
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Test Toast Title")).toBeInTheDocument();
    expect(screen.getByText("Test Toast Description")).toBeInTheDocument();
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("should render multiple toasts", () => {
    mockUseToast.mockReturnValue({
      toasts: [
        { id: "1", title: "Toast 1" },
        { id: "2", description: "Description 2" },
        { id: "3", title: "Toast 3", description: "Description 3" },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Toast 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
    expect(screen.getByText("Description 3")).toBeInTheDocument();
    expect(screen.getAllByTestId("x-icon").length).toBe(3);
  });

  it("should render toast with an action button", () => {
    const mockAction = (<button>Action!</button>) as ToastActionElement;
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: "1",
          title: "Toast with Action",
          action: mockAction,
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Toast with Action")).toBeInTheDocument();
    expect(screen.getByText("Action!")).toBeInTheDocument();
  });

  it("should pass props to Toast component", () => {
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: "1",
          title: "Destructive Toast",
          variant: "destructive",
          className: "custom-toast-class",
        },
      ],
    });
    render(<Toaster />);
    const toastElement = screen.getByText("Destructive Toast").closest("li");
    expect(toastElement).toHaveClass("destructive");
    expect(toastElement).toHaveClass("custom-toast-class");
  });

  it("should render correctly when only title is provided", () => {
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: "1",
          title: "Only Title Here",
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Only Title Here")).toBeInTheDocument();
    expect(
      screen.queryByText(/^Test Toast Description/)
    ).not.toBeInTheDocument();
  });

  it("should render correctly when only description is provided", () => {
    mockUseToast.mockReturnValue({
      toasts: [
        {
          id: "1",
          description: "Only Description Here",
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Only Description Here")).toBeInTheDocument();
    expect(screen.queryByText(/^Test Toast Title/)).not.toBeInTheDocument();
  });
});
