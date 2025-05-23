import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";
import React from "react";

if (
  typeof window !== "undefined" &&
  typeof window.ResizeObserver === "undefined"
) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof window !== "undefined" && typeof window.matchMedia === "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

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

const TestDrawer = ({
  title = "Drawer Title",
  description = "Drawer description text.",
  content = <p>Drawer main content.</p>,
  footerContent = <button>Footer Button</button>,
  triggerText = "Open Drawer",
  onOpenChange,
}: {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footerContent?: React.ReactNode;
  triggerText?: string;
  onOpenChange?: (open: boolean) => void;
}) => (
  <Drawer onOpenChange={onOpenChange}>
    <DrawerTrigger data-testid="drawer-trigger">{triggerText}</DrawerTrigger>

    <DrawerContent data-testid="drawer-content">
      <DrawerHeader>
        <DrawerTitle data-testid="drawer-title">{title}</DrawerTitle>
        <DrawerDescription data-testid="drawer-description">
          {description}
        </DrawerDescription>
      </DrawerHeader>
      <div data-testid="drawer-main-content">{content}</div>
      <DrawerFooter data-testid="drawer-footer">{footerContent}</DrawerFooter>
    </DrawerContent>
  </Drawer>
);

describe("Drawer Component", () => {
  test("should render DrawerTrigger and not show content initially", () => {
    render(<TestDrawer />);
    expect(screen.getByTestId("drawer-trigger")).toBeInTheDocument();
    expect(screen.getByText("Open Drawer")).toBeInTheDocument();

    expect(screen.queryByTestId("drawer-content")).not.toBeInTheDocument();
  });

  test("should open drawer and show content when trigger is clicked", async () => {
    render(<TestDrawer />);
    const trigger = screen.getByTestId("drawer-trigger");
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByTestId("drawer-content")).toBeVisible();
    });

    expect(screen.getByTestId("drawer-title")).toHaveTextContent(
      "Drawer Title"
    );
    expect(screen.getByTestId("drawer-description")).toHaveTextContent(
      "Drawer description text."
    );
    expect(screen.getByTestId("drawer-main-content")).toHaveTextContent(
      "Drawer main content."
    );
    expect(screen.getByTestId("drawer-footer")).toBeInTheDocument();
    expect(screen.getByText("Footer Button")).toBeInTheDocument();

    expect(screen.getByTestId("drawer-handle")).toBeInTheDocument();
  });

  test("DrawerContent should have accessibility attributes (Vaul specific)", async () => {
    render(<TestDrawer />);
    await userEvent.click(screen.getByTestId("drawer-trigger"));

    let drawerContent: HTMLElement | null = null;
    await waitFor(async () => {
      drawerContent = screen.getByTestId("drawer-content");
      expect(drawerContent).toBeVisible();

      expect(drawerContent).toHaveAttribute("role", "dialog");

      expect(drawerContent).toHaveAttribute("data-state", "open");
    });

    const drawerTitle = screen.getByTestId("drawer-title");
    const drawerDescription = screen.getByTestId("drawer-description");
    if (drawerContent && drawerTitle.id) {
      expect(drawerContent).toHaveAttribute("aria-labelledby", drawerTitle.id);
    }
    if (drawerContent && drawerDescription.id) {
      expect(drawerContent).toHaveAttribute(
        "aria-describedby",
        drawerDescription.id
      );
    }
  });

  test("should close drawer when Escape key is pressed", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestDrawer onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByTestId("drawer-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("drawer-content")).toBeVisible()
    );

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      const content = screen.queryByTestId("drawer-content");
      expect(content).toHaveAttribute("data-state", "closed");
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("should close drawer when overlay is clicked", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestDrawer onOpenChange={onOpenChangeMock} />);
    await userEvent.click(screen.getByTestId("drawer-trigger"));

    let drawerOverlay: HTMLElement | null = null;
    await waitFor(() => {
      expect(screen.getByTestId("drawer-content")).toBeVisible();

      drawerOverlay = document.querySelector(
        ".fixed.inset-0.z-50.bg-black\\/80"
      );
      expect(drawerOverlay).toBeInTheDocument();
      expect(drawerOverlay).toBeVisible();
    });

    if (drawerOverlay) {
      await userEvent.click(drawerOverlay);
    }

    await waitFor(() => {
      const content = screen.queryByTestId("drawer-content");
      expect(content).toHaveAttribute("data-state", "closed");
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("DrawerHeader, Footer, Title, Description render correctly", async () => {
    render(
      <Drawer open={true} onOpenChange={() => {}}>
        <DrawerContent>
          <DrawerHeader data-testid="header">
            <DrawerTitle data-testid="title">Custom Drawer Title</DrawerTitle>
            <DrawerDescription data-testid="description">
              Custom Drawer Description
            </DrawerDescription>
          </DrawerHeader>
          <div>Main Drawer Content</div>
          <DrawerFooter data-testid="footer">
            <button>Action</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toHaveTextContent(
      "Custom Drawer Title"
    );
    expect(screen.getByTestId("description")).toHaveTextContent(
      "Custom Drawer Description"
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  test("should pass className to Drawer parts", async () => {
    render(
      <Drawer open={true} onOpenChange={() => {}}>
        <DrawerPortal>
          <DrawerOverlay
            className="custom-overlay-class"
            data-testid="overlay"
          />
        </DrawerPortal>
        <DrawerContent className="custom-content-class" data-testid="content">
          <DrawerHeader className="custom-header-class" data-testid="header">
            <DrawerTitle className="custom-title-class" data-testid="title">
              Title
            </DrawerTitle>
            <DrawerDescription
              className="custom-description-class"
              data-testid="description"
            >
              Description
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="custom-footer-class" data-testid="footer">
            Footer
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByTestId("overlay")).toHaveClass("custom-overlay-class");
    expect(screen.getByTestId("content")).toHaveClass("custom-content-class");
    expect(screen.getByTestId("header")).toHaveClass("custom-header-class");
    expect(screen.getByTestId("title")).toHaveClass("custom-title-class");
    expect(screen.getByTestId("description")).toHaveClass(
      "custom-description-class"
    );
    expect(screen.getByTestId("footer")).toHaveClass("custom-footer-class");
  });
});
