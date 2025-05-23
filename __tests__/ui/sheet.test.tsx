import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}));

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

const TestSheet = ({
  triggerText = "Open Sheet",
  titleText = "Sheet Title",
  descriptionText = "Sheet description.",
  contentText = "Main sheet content.",
  footerText = "Footer content",
  footerCloseButtonText = "Close Footer",
  sheetProps = {},
  contentProps = {},
  triggerProps = {},
  closeProps = {},
  headerProps = {},
  titleProps = {},
  descriptionProps = {},
  footerProps = {},
  overlayProps = {},
}: {
  triggerText?: string;
  titleText?: string;
  descriptionText?: string;
  contentText?: string;
  footerText?: string;
  footerCloseButtonText?: string;
  sheetProps?: Partial<React.ComponentProps<typeof Sheet>>;
  contentProps?: Partial<React.ComponentProps<typeof SheetContent>>;
  triggerProps?: Partial<React.ComponentProps<typeof SheetTrigger>>;
  closeProps?: Partial<React.ComponentProps<typeof SheetClose>>;
  headerProps?: Partial<React.ComponentProps<typeof SheetHeader>>;
  titleProps?: Partial<React.ComponentProps<typeof SheetTitle>>;
  descriptionProps?: Partial<React.ComponentProps<typeof SheetDescription>>;
  footerProps?: Partial<React.ComponentProps<typeof SheetFooter>>;
  overlayProps?: Partial<React.ComponentProps<typeof SheetOverlay>>;
}) => (
  <Sheet {...sheetProps}>
    <SheetTrigger data-testid="sheet-trigger" {...triggerProps}>
      {triggerProps.asChild ? triggerProps.children : triggerText}
    </SheetTrigger>
    <SheetPortal>
      <SheetOverlay data-testid="sheet-overlay" {...overlayProps} />
      <SheetContent data-testid="sheet-content" {...contentProps}>
        <SheetHeader data-testid="sheet-header" {...headerProps}>
          <SheetTitle data-testid="sheet-title" {...titleProps}>
            {titleText}
          </SheetTitle>
          <SheetDescription
            data-testid="sheet-description"
            {...descriptionProps}
          >
            {descriptionText}
          </SheetDescription>
        </SheetHeader>
        <div data-testid="sheet-main-content">{contentText}</div>
        <SheetFooter data-testid="sheet-footer" {...footerProps}>
          <p>{footerText}</p>
          <SheetClose data-testid="sheet-close-button-footer" {...closeProps}>
            {closeProps.asChild ? closeProps.children : footerCloseButtonText}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </SheetPortal>
  </Sheet>
);

describe("Sheet Component", () => {
  test("should render SheetTrigger and sheet is initially hidden", () => {
    render(<TestSheet />);
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
    expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sheet-overlay")).not.toBeInTheDocument();
  });

  test("should open sheet with default (right) side on trigger click", async () => {
    render(<TestSheet />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("sheet-content")).toBeVisible();
    });
    expect(screen.getByTestId("sheet-overlay")).toBeVisible();
    expect(screen.getByTestId("sheet-title")).toHaveTextContent("Sheet Title");
    expect(screen.getByTestId("sheet-description")).toHaveTextContent(
      "Sheet description."
    );
    expect(screen.getByTestId("sheet-main-content")).toHaveTextContent(
      "Main sheet content."
    );
    expect(screen.getByTestId("sheet-footer")).toHaveTextContent(
      "Footer content"
    );
    expect(screen.getByTestId("sheet-content")).toHaveClass(
      "sm:max-w-sm",
      "inset-y-0",
      "right-0"
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  const sides: Array<"top" | "bottom" | "left" | "right"> = [
    "top",
    "bottom",
    "left",
    "right",
  ];
  sides.forEach((side) => {
    test("should render sheet on the " + side + " side", async () => {
      render(<TestSheet contentProps={{ side }} />);
      await userEvent.click(screen.getByTestId("sheet-trigger"));
      await waitFor(() =>
        expect(screen.getByTestId("sheet-content")).toBeVisible()
      );
      const sheetContent = screen.getByTestId("sheet-content");
      if (side === "top")
        expect(sheetContent).toHaveClass("inset-x-0", "top-0", "border-b");
      if (side === "bottom")
        expect(sheetContent).toHaveClass("inset-x-0", "bottom-0", "border-t");
      if (side === "left")
        expect(sheetContent).toHaveClass(
          "inset-y-0",
          "left-0",
          "h-full",
          "w-3/4",
          "border-r",
          "sm:max-w-sm"
        );
      if (side === "right")
        expect(sheetContent).toHaveClass(
          "inset-y-0",
          "right-0",
          "h-full",
          "w-3/4",
          "border-l",
          "sm:max-w-sm"
        );
    });
  });

  test("should close sheet when SheetClose (X icon) is clicked", async () => {
    render(<TestSheet />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await userEvent.click(closeButton);
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
  });

  test("should close sheet when footer SheetClose button is clicked", async () => {
    render(<TestSheet footerCloseButtonText="Close Me Test" />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    const footerCloseButton = screen.getByRole("button", {
      name: "Close Me Test",
    });
    await userEvent.click(footerCloseButton);
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
  });

  test("should close sheet on Escape key press", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestSheet sheetProps={{ onOpenChange: onOpenChangeMock }} />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    await userEvent.keyboard("{escape}");
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("should close sheet when overlay is clicked", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestSheet sheetProps={{ onOpenChange: onOpenChangeMock }} />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    const overlay = await screen.findByTestId("sheet-overlay");
    expect(overlay).toBeVisible();

    await userEvent.click(overlay);
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  test("SheetContent has correct ARIA attributes", async () => {
    render(<TestSheet />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    const sheetContent = await screen.findByTestId("sheet-content");
    const sheetTitle = screen.getByTestId("sheet-title");
    const sheetDescription = screen.getByTestId("sheet-description");

    expect(sheetContent).toHaveAttribute("role", "dialog");
    expect(sheetContent).toHaveAttribute("aria-labelledby", sheetTitle.id);
    expect(sheetContent).toHaveAttribute(
      "aria-describedby",
      sheetDescription.id
    );
  });

  test("SheetHeader, Footer, Title, Description render with custom classNames", async () => {
    render(
      <TestSheet
        headerProps={{ className: "custom-header" }}
        footerProps={{ className: "custom-footer" }}
        titleProps={{ className: "custom-title" }}
        descriptionProps={{ className: "custom-description" }}
      />
    );
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    expect(screen.getByTestId("sheet-header")).toHaveClass("custom-header");
    expect(screen.getByTestId("sheet-footer")).toHaveClass("custom-footer");
    expect(screen.getByTestId("sheet-title")).toHaveClass("custom-title");
    expect(screen.getByTestId("sheet-description")).toHaveClass(
      "custom-description"
    );
  });

  test("SheetOverlay renders with custom className", async () => {
    render(<TestSheet overlayProps={{ className: "custom-overlay" }} />);
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    const overlay = await screen.findByTestId("sheet-overlay");
    expect(overlay).toHaveClass("custom-overlay");
  });

  test("controlled open and onOpenChange props", async () => {
    const onOpenChangeMock = jest.fn();
    const { rerender } = render(
      <TestSheet sheetProps={{ open: false, onOpenChange: onOpenChangeMock }} />
    );
    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();

    rerender(
      <TestSheet sheetProps={{ open: true, onOpenChange: onOpenChangeMock }} />
    );
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    await userEvent.keyboard("{escape}");
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    rerender(
      <TestSheet sheetProps={{ open: false, onOpenChange: onOpenChangeMock }} />
    );
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
  });

  test("SheetTrigger can use asChild prop", async () => {
    render(
      <TestSheet
        triggerProps={{
          asChild: true,
          children: <button type="button">Custom Button</button>,
        }}
      />
    );
    const triggerButton = screen.getByRole("button", { name: "Custom Button" });
    expect(triggerButton).toBeInTheDocument();
    await userEvent.click(triggerButton);
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );
  });

  test("SheetClose can use asChild prop", async () => {
    render(
      <TestSheet
        closeProps={{
          asChild: true,
          children: <button type="button">Custom Close Me</button>,
        }}
        footerText=""
        footerCloseButtonText=""
      />
    );
    await userEvent.click(screen.getByTestId("sheet-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("sheet-content")).toBeVisible()
    );

    const customCloseButton = screen.getByRole("button", {
      name: "Custom Close Me",
    });
    expect(customCloseButton).toBeInTheDocument();
    await userEvent.click(customCloseButton);
    await waitFor(() =>
      expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument()
    );
  });

  test("forwards refs correctly to wrapped components", async () => {
    const overlayRef = React.createRef<HTMLDivElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();
    const descriptionRef = React.createRef<HTMLParagraphElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const closeRef = React.createRef<HTMLButtonElement>();

    render(
      <Sheet open={true} onOpenChange={() => {}}>
        <SheetTrigger ref={triggerRef}>Open</SheetTrigger>
        <SheetPortal>
          <SheetOverlay ref={overlayRef} />
          <SheetContent ref={contentRef}>
            <SheetHeader>
              <SheetTitle ref={titleRef}>Title</SheetTitle>
              <SheetDescription ref={descriptionRef}>Desc</SheetDescription>
            </SheetHeader>
            <SheetClose ref={closeRef} />
          </SheetContent>
        </SheetPortal>
      </Sheet>
    );

    await waitFor(() => {
      expect(overlayRef.current).toBeInstanceOf(HTMLDivElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(closeRef.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
