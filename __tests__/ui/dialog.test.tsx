import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import React from "react";

if (typeof window !== "undefined" && typeof window.DOMRect === "undefined") {
  // @ts-ignore
  window.DOMRect = class DOMRect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    static fromRect(other?: DOMRectInit): DOMRect {
      return new DOMRect(other?.x, other?.y, other?.width, other?.height);
    }
    toJSON() {
      return JSON.stringify(this);
    }
  };
}

const TestDialog = ({
  title = "Dialog Title",
  description = "Dialog description text.",
  content = <p>Dialog main content.</p>,
  footerContent = <button>Footer Button</button>,
  triggerText = "Open Dialog",
  onOpenChange,
}: {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footerContent?: React.ReactNode;
  triggerText?: string;
  onOpenChange?: (open: boolean) => void;
}) => (
  <Dialog onOpenChange={onOpenChange}>
    <DialogTrigger data-testid="dialog-trigger">{triggerText}</DialogTrigger>
    <DialogContent data-testid="dialog-content">
      <DialogHeader>
        <DialogTitle data-testid="dialog-title">{title}</DialogTitle>
        <DialogDescription data-testid="dialog-description">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div data-testid="dialog-main-content">{content}</div>
      <DialogFooter data-testid="dialog-footer">{footerContent}</DialogFooter>
    </DialogContent>
  </Dialog>
);

describe("Dialog Component", () => {
  test("should render DialogTrigger and not show content initially", () => {
    render(<TestDialog />);
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
  });

  test("should open dialog and show content when trigger is clicked", async () => {
    render(<TestDialog />);
    const trigger = screen.getByTestId("dialog-trigger");
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId("dialog-content")).toBeVisible();
    });

    expect(screen.getByTestId("dialog-title")).toHaveTextContent(
      "Dialog Title"
    );
    expect(screen.getByTestId("dialog-description")).toHaveTextContent(
      "Dialog description text."
    );
    expect(screen.getByTestId("dialog-main-content")).toHaveTextContent(
      "Dialog main content."
    );
    expect(screen.getByTestId("dialog-footer")).toBeInTheDocument();
    expect(screen.getByText("Footer Button")).toBeInTheDocument();
  });

  test("DialogContent should have accessibility attributes", async () => {
    render(<TestDialog />);
    await userEvent.click(screen.getByTestId("dialog-trigger"));

    const dialogContent = await screen.findByTestId("dialog-content");
    expect(dialogContent).toBeVisible();
    expect(dialogContent).toHaveAttribute("role", "dialog");

    const dialogTitle = screen.getByTestId("dialog-title");
    expect(dialogContent).toHaveAttribute("aria-labelledby", dialogTitle.id);
    const dialogDescription = screen.getByTestId("dialog-description");
    if (dialogDescription) {
      await waitFor(() =>
        expect(dialogContent).toHaveAttribute(
          "aria-describedby",
          dialogDescription.id
        )
      );
    }
  });

  test("should close dialog when Escape key is pressed", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestDialog onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByTestId("dialog-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("dialog-content")).toBeVisible();
    });

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("should close dialog when overlay is clicked (if applicable for Radix default)", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestDialog onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByTestId("dialog-trigger"));

    let dialogOverlay: HTMLElement | null = null;
    await waitFor(() => {
      expect(screen.getByTestId("dialog-content")).toBeVisible();
      dialogOverlay = document.querySelector(".fixed.inset-0.z-50");
      expect(dialogOverlay).toBeInTheDocument();
      expect(dialogOverlay).toBeVisible();
    });

    if (dialogOverlay) {
      document.body.style.pointerEvents = "auto";
      await userEvent.click(dialogOverlay);
    }

    await waitFor(() => {
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("should close dialog when DialogClose button is clicked", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestDialog onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByTestId("dialog-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("dialog-content")).toBeVisible();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("DialogHeader, DialogFooter, DialogTitle, DialogDescription render correctly", async () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle data-testid="title">Custom Title</DialogTitle>
            <DialogDescription data-testid="description">
              Custom Description
            </DialogDescription>
          </DialogHeader>
          Main Content
          <DialogFooter data-testid="footer">
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toHaveTextContent("Custom Title");
    expect(screen.getByTestId("description")).toHaveTextContent(
      "Custom Description"
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  test("should pass className to Dialog parts", async () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="custom-content-class" data-testid="content">
          <DialogHeader className="custom-header-class" data-testid="header">
            <DialogTitle className="custom-title-class" data-testid="title">
              Title
            </DialogTitle>
            <DialogDescription
              className="custom-description-class"
              data-testid="description"
            >
              Description
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer-class" data-testid="footer">
            Footer
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("content")).toHaveClass("custom-content-class");
    expect(screen.getByTestId("header")).toHaveClass("custom-header-class");
    expect(screen.getByTestId("title")).toHaveClass("custom-title-class");
    expect(screen.getByTestId("description")).toHaveClass(
      "custom-description-class"
    );
    expect(screen.getByTestId("footer")).toHaveClass("custom-footer-class");
  });
});
