import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
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

const TestHoverCard = ({
  triggerText = "Hover Me",
  contentText = "This is the hover card content.",
  contentProps = {},
  onOpenChange,
  contentId = "test-hover-content-id",
}: {
  triggerText?: string;
  contentText?: string;
  contentProps?: Partial<
    React.ComponentPropsWithoutRef<typeof HoverCardContent>
  >;
  onOpenChange?: (open: boolean) => void;
  contentId?: string;
}) => (
  <HoverCard onOpenChange={onOpenChange}>
    <HoverCardTrigger data-testid="hover-trigger" href="#">
      {triggerText}
    </HoverCardTrigger>
    <HoverCardContent
      data-testid="hover-content"
      id={contentId}
      {...contentProps}
    >
      <p>{contentText}</p>
    </HoverCardContent>
  </HoverCard>
);

describe("HoverCard Component", () => {
  test("should render trigger and not show content initially", () => {
    render(<TestHoverCard />);
    expect(screen.getByTestId("hover-trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("hover-content")).not.toBeInTheDocument();
  });

  test("should show content on trigger hover and hide on unhover", async () => {
    const onOpenChangeMock = jest.fn();
    render(<TestHoverCard onOpenChange={onOpenChangeMock} />);
    const trigger = screen.getByTestId("hover-trigger");

    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getByTestId("hover-content")).toBeVisible();
      expect(onOpenChangeMock).toHaveBeenCalledWith(true);
    });
    expect(screen.getByTestId("hover-content")).toHaveTextContent(
      "This is the hover card content."
    );

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByTestId("hover-content")).not.toBeInTheDocument();
      expect(onOpenChangeMock).toHaveBeenCalledTimes(2);
      expect(onOpenChangeMock).toHaveBeenLastCalledWith(false);
    });
  });

  test("should apply contentProps like className, align, and sideOffset", async () => {
    render(
      <TestHoverCard
        contentProps={{
          className: "custom-class",
          align: "start",
          sideOffset: 10,
        }}
      />
    );
    const trigger = screen.getByTestId("hover-trigger");
    await userEvent.hover(trigger);

    let contentElement: HTMLElement | null = null;
    await waitFor(() => {
      contentElement = screen.getByTestId("hover-content");
      expect(contentElement).toBeVisible();
    });

    expect(contentElement).toHaveClass("custom-class");

    expect(contentElement).toHaveAttribute("data-align", "start");
  });
});
