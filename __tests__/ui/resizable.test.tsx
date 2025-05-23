import React from "react";
import { render, screen } from "@testing-library/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  GripVertical: (props: any) => (
    <svg data-testid="grip-vertical-icon" {...props} />
  ),
}));

describe("Resizable Components Suite", () => {
  describe("ResizablePanelGroup", () => {
    it("should render with default classes", () => {
      render(
        <ResizablePanelGroup direction="horizontal" data-testid="rpg">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      const group = screen.getByTestId("rpg");
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass("flex h-full w-full");
    });

    it("should apply vertical classes when direction is vertical", () => {
      render(
        <ResizablePanelGroup direction="vertical" data-testid="rpg-vertical">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      const group = screen.getByTestId("rpg-vertical");
      expect(group).toHaveClass(
        "data-[panel-group-direction=vertical]:flex-col"
      );
    });

    it("should merge className for ResizablePanelGroup", () => {
      render(
        <ResizablePanelGroup
          direction="horizontal"
          className="custom-group"
          data-testid="rpg"
        >
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>
      );
      expect(screen.getByTestId("rpg")).toHaveClass("custom-group");
    });
  });

  describe("ResizablePanel", () => {
    it("should render its children", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div>Test Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      );
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("ResizableHandle", () => {
    it("should render with default classes", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle data-testid="rh" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      const handle = screen.getByTestId("rh");
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveClass(
        "relative flex w-px items-center justify-center bg-border"
      );
    });

    it("should merge className for ResizableHandle", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle className="custom-handle" data-testid="rh" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      expect(screen.getByTestId("rh")).toHaveClass("custom-handle");
    });

    it("should render GripVertical icon when withHandle is true", () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle data-testid="rh" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      const handle = screen.getByTestId("rh");
      expect(
        handle.querySelector('[data-testid="grip-vertical-icon"]')
      ).toBeInTheDocument();

      expect(handle.querySelector(".z-10.flex.h-4.w-3")).toBeInTheDocument();
    });

    it("should not render GripVertical icon when withHandle is false or not provided", () => {
      const { rerender } = render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle={false} data-testid="rh" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      let handle = screen.getByTestId("rh");
      expect(
        handle.querySelector('[data-testid="grip-vertical-icon"]')
      ).not.toBeInTheDocument();

      rerender(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle data-testid="rh-no-prop" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );
      handle = screen.getByTestId("rh-no-prop");
      expect(
        handle.querySelector('[data-testid="grip-vertical-icon"]')
      ).not.toBeInTheDocument();
    });
  });
});
