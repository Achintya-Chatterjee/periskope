import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toggleVariants } from "@/components/ui/toggle";

describe("ToggleGroup Components", () => {
  describe("ToggleGroup", () => {
    it("should render children and apply default classes", () => {
      render(
        <ToggleGroup type="single" data-testid="toggle-group">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );
      const group = screen.getByTestId("toggle-group");
      expect(group).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(group).toHaveClass("flex items-center justify-center gap-1");
    });

    it("should apply custom className to ToggleGroup", () => {
      render(
        <ToggleGroup
          type="single"
          className="custom-group"
          data-testid="toggle-group"
        >
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );
      expect(screen.getByTestId("toggle-group")).toHaveClass("custom-group");
    });

    it("should forward ref to ToggleGroupPrimitive.Root", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ToggleGroup type="single" ref={ref}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("ToggleGroupItem", () => {
    it("should render children and apply default toggleVariants", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" data-testid="item1">
            Item 1 Content
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item = screen.getByTestId("item1");
      expect(item).toBeInTheDocument();
      expect(screen.getByText("Item 1 Content")).toBeInTheDocument();
      expect(item).toHaveClass("bg-transparent");
      expect(item).toHaveClass("h-10");
      expect(item).toHaveClass("hover:bg-muted");
      expect(item).toHaveClass("hover:text-muted-foreground");
    });

    it("should apply custom className to ToggleGroupItem", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem
            value="item1"
            className="custom-item"
            data-testid="item1"
          >
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      expect(screen.getByTestId("item1")).toHaveClass("custom-item");
    });

    it("should forward ref to ToggleGroupPrimitive.Item", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" ref={ref}>
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should use variant and size from ToggleGroupContext", () => {
      render(
        <ToggleGroup type="single" variant="outline" size="sm">
          <ToggleGroupItem value="item1" data-testid="item1">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item = screen.getByTestId("item1");
      expect(item).toHaveClass("border-input");
      expect(item).toHaveClass("hover:bg-accent");
      expect(item).toHaveClass("hover:text-accent-foreground");
      expect(item).not.toHaveClass("hover:bg-muted");
      expect(item).toHaveClass("h-9");
    });

    it("should allow ToggleGroupItem to override context variant and size", () => {
      render(
        <ToggleGroup type="single" variant="default" size="default">
          <ToggleGroupItem
            value="item1"
            variant="outline"
            size="lg"
            data-testid="item1"
          >
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item = screen.getByTestId("item1");
      expect(item).toHaveClass("border-input");
      expect(item).toHaveClass("hover:bg-accent");
      expect(item).toHaveClass("hover:text-accent-foreground");
      expect(item).not.toHaveClass("hover:bg-muted");
      expect(item).toHaveClass("h-11");
    });

    it("should handle single type selection", () => {
      const onValueChange = jest.fn();
      render(
        <ToggleGroup type="single" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1" data-testid="item1">
            Item 1
          </ToggleGroupItem>
          <ToggleGroupItem value="item2" data-testid="item2">
            Item 2
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");

      fireEvent.click(item1);
      expect(onValueChange).toHaveBeenCalledWith("item1");
      expect(item1).toHaveAttribute("data-state", "on");
      expect(item2).toHaveAttribute("data-state", "off");

      fireEvent.click(item2);
      expect(onValueChange).toHaveBeenCalledWith("item2");
      expect(item1).toHaveAttribute("data-state", "off");
      expect(item2).toHaveAttribute("data-state", "on");

      fireEvent.click(item2);
      expect(onValueChange).toHaveBeenCalledWith("");
      expect(item2).toHaveAttribute("data-state", "off");
    });

    it("should handle multiple type selection", () => {
      const onValueChange = jest.fn();
      render(
        <ToggleGroup type="multiple" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1" data-testid="item1">
            Item 1
          </ToggleGroupItem>
          <ToggleGroupItem value="item2" data-testid="item2">
            Item 2
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");

      fireEvent.click(item1);
      expect(onValueChange).toHaveBeenCalledWith(["item1"]);
      expect(item1).toHaveAttribute("data-state", "on");

      fireEvent.click(item2);
      expect(onValueChange).toHaveBeenCalledWith(["item1", "item2"]);
      expect(item1).toHaveAttribute("data-state", "on");
      expect(item2).toHaveAttribute("data-state", "on");

      fireEvent.click(item1);
      expect(onValueChange).toHaveBeenCalledWith(["item2"]);
      expect(item1).toHaveAttribute("data-state", "off");
      expect(item2).toHaveAttribute("data-state", "on");
    });

    it("should be disabled if the disabled prop is set on ToggleGroupItem", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" data-testid="item1" disabled>
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item1 = screen.getByTestId("item1");
      expect(item1).toBeDisabled();
      fireEvent.click(item1);
      expect(item1).toHaveAttribute("data-state", "off");
    });

    it("should be disabled if the disabled prop is set on ToggleGroup", () => {
      render(
        <ToggleGroup type="single" disabled data-testid="group">
          <ToggleGroupItem value="item1" data-testid="item1">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );
      const item1 = screen.getByTestId("item1");
      expect(item1).toBeDisabled();
      fireEvent.click(item1);
      expect(item1).toHaveAttribute("data-state", "off");
    });
  });
});
