import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import React from "react";

describe("Collapsible Components", () => {
  const TestCollapsible = ({
    defaultOpen = false,
    open,
    onOpenChange,
    disabled = false,
  }: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
  }) => (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <CollapsibleTrigger disabled={disabled} data-testid="trigger">
        Toggle
      </CollapsibleTrigger>
      <CollapsibleContent data-testid="content">
        <p>Collapsible content</p>
      </CollapsibleContent>
    </Collapsible>
  );

  it("should render trigger and content (content initially hidden)", () => {
    render(<TestCollapsible />);
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.getByText("Toggle")).toBeInTheDocument();
    const content = screen.getByTestId("content");
    expect(content).toBeInTheDocument();
    expect(content).not.toBeVisible();
  });

  it("should toggle content visibility on trigger click", async () => {
    render(<TestCollapsible />);
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    expect(content).not.toBeVisible();
    fireEvent.click(trigger);
    await waitFor(() => expect(content).toBeVisible());

    fireEvent.click(trigger);
    await waitFor(() => expect(content).not.toBeVisible());
  });

  it("should respect defaultOpen prop", async () => {
    render(<TestCollapsible defaultOpen={true} />);
    const content = screen.getByTestId("content");
    await waitFor(() => expect(content).toBeVisible());
  });

  it("should work as a controlled component with open and onOpenChange", async () => {
    const onOpenChangeMock = jest.fn();
    const { rerender } = render(
      <TestCollapsible open={false} onOpenChange={onOpenChangeMock} />
    );
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    expect(content).not.toBeVisible();

    fireEvent.click(trigger);
    expect(onOpenChangeMock).toHaveBeenCalledWith(true);

    rerender(<TestCollapsible open={true} onOpenChange={onOpenChangeMock} />);
    await waitFor(() => expect(content).toBeVisible());

    fireEvent.click(trigger);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    rerender(<TestCollapsible open={false} onOpenChange={onOpenChangeMock} />);
    await waitFor(() => expect(content).not.toBeVisible());
  });

  it("should not toggle when trigger is disabled", async () => {
    render(<TestCollapsible disabled={true} />);
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    expect(trigger).toBeDisabled();
    expect(content).not.toBeVisible();

    fireEvent.click(trigger);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(content).not.toBeVisible();
  });

  it("CollapsibleTrigger should have correct aria-expanded and data-state attributes", async () => {
    render(<TestCollapsible />);
    const trigger = screen.getByTestId("trigger");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-state", "closed");
    });
  });

  it("CollapsibleContent should have correct data-state attribute", async () => {
    render(<TestCollapsible />);
    const trigger = screen.getByTestId("trigger");
    const content = screen.getByTestId("content");

    expect(content).toHaveAttribute("data-state", "closed");

    fireEvent.click(trigger);
    await waitFor(() => expect(content).toHaveAttribute("data-state", "open"));

    fireEvent.click(trigger);
    await waitFor(() =>
      expect(content).toHaveAttribute("data-state", "closed")
    );
  });
});
