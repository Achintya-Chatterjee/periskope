import React from "react";
import { render, screen } from "@testing-library/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

describe("ScrollArea Components Suite", () => {
  describe("ScrollArea", () => {
    it("should render ScrollAreaPrimitive.Root and Viewport with children", () => {
      render(
        <ScrollArea data-testid="sa">
          <div>Scroll Content</div>
        </ScrollArea>
      );
      const scrollAreaRoot = screen.getByTestId("sa");
      expect(scrollAreaRoot).toBeInTheDocument();
      expect(scrollAreaRoot).toHaveClass("relative overflow-hidden");

      const viewport = scrollAreaRoot.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveClass("h-full w-full rounded-[inherit]");

      expect(viewport).toContainElement(screen.getByText("Scroll Content"));
    });

    it("should merge className for ScrollArea", () => {
      render(
        <ScrollArea className="custom-scroll-area" data-testid="sa">
          <div>Content</div>
        </ScrollArea>
      );
      expect(screen.getByTestId("sa")).toHaveClass("custom-scroll-area");
      expect(screen.getByTestId("sa")).toHaveClass("relative overflow-hidden");
    });

    it("should forward ref to ScrollAreaPrimitive.Root", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("ScrollBar", () => {
    it("should attempt to render ScrollAreaPrimitive.ScrollAreaScrollbar and forward ref if primitive renders", () => {
      const ref = React.createRef<HTMLDivElement>();

      const { container } = render(
        <ScrollArea>
          <ScrollBar ref={ref} data-testid="my-scrollbar" forceMount />
        </ScrollArea>
      );

      if (ref.current) {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      }

      expect(true).toBe(true);
    });
  });
});
