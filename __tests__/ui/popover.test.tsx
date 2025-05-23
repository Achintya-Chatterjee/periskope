import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TestPopover = ({
  triggerText = "Open Popover",
  contentText = "Popover Content",
  contentProps = {},
  triggerProps = {},
  open = undefined,
  onOpenChange = undefined,
}: {
  triggerText?: string;
  contentText?: string;
  contentProps?: Partial<React.ComponentPropsWithRef<typeof PopoverContent>>;
  triggerProps?: Partial<React.ComponentPropsWithoutRef<typeof PopoverTrigger>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger {...triggerProps} asChild={triggerProps.asChild ?? false}>
      {triggerProps.asChild ? <button>{triggerText}</button> : triggerText}
    </PopoverTrigger>
    <PopoverContent {...contentProps}>
      <p>{contentText}</p>
      <label htmlFor="test-input">Label</label>
      <input type="text" id="test-input" defaultValue="Input inside popover" />
    </PopoverContent>
  </Popover>
);

describe("Popover Component", () => {
  it("should render PopoverTrigger", () => {
    render(<TestPopover />);
    expect(screen.getByText("Open Popover")).toBeInTheDocument();
  });

  it("PopoverTrigger should open PopoverContent on click", async () => {
    render(<TestPopover />);
    const trigger = screen.getByText("Open Popover");

    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls");
    const contentId = trigger.getAttribute("aria-controls");

    const popoverContent = screen
      .getByText("Popover Content")
      .closest('[role="dialog"]');

    const actualContentElement = screen
      .getByText("Popover Content")
      .parentElement?.closest("div[data-radix-popper-content-wrapper]");
    const contentPrimitive = actualContentElement?.querySelector(
      ":scope > div[data-state]"
    );

    expect(contentPrimitive).toHaveAttribute("data-state", "open");
    if (contentId) {
      expect(contentPrimitive).toHaveAttribute("id", contentId);
    }
  });

  it("PopoverContent should have default classes and attributes", async () => {
    render(<TestPopover />);
    await userEvent.click(screen.getByText("Open Popover"));

    const contentElement = await screen.findByText("Popover Content");
    const popoverPrimitiveContent = contentElement.closest(
      ".z-50.w-72.rounded-md"
    );

    expect(popoverPrimitiveContent).toBeInTheDocument();
    expect(popoverPrimitiveContent).toHaveClass(
      "border bg-popover p-4 text-popover-foreground shadow-md outline-none"
    );
  });

  it("PopoverContent should apply className prop", async () => {
    render(
      <TestPopover contentProps={{ className: "custom-popover-class" }} />
    );
    await userEvent.click(screen.getByText("Open Popover"));

    const contentElement = await screen.findByText("Popover Content");

    const popoverPrimitiveContent = contentElement.closest(
      ".custom-popover-class"
    );
    expect(popoverPrimitiveContent).toBeInTheDocument();
  });

  it("should close PopoverContent on Escape key press", async () => {
    render(<TestPopover />);
    await userEvent.click(screen.getByText("Open Popover"));
    await screen.findByText("Popover Content");

    await userEvent.keyboard("{escape}");

    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Open Popover")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("should close PopoverContent on outside click", async () => {
    render(
      <div>
        <button>Outside Button</button>
        <TestPopover />
      </div>
    );
    await userEvent.click(screen.getByText("Open Popover"));
    await screen.findByText("Popover Content");
    await userEvent.click(screen.getByText("Outside Button"));

    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });
  });

  it("PopoverContent should forward ref", async () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TestPopover contentProps={{ ref }} />);
    await userEvent.click(screen.getByText("Open Popover"));

    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    expect(ref.current?.textContent).toContain("Popover Content");
  });

  it("PopoverContent should respect align and sideOffset props", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={10}
          data-testid="popover-content"
        >
          <p>Aligned Content</p>
        </PopoverContent>
      </Popover>
    );
    await userEvent.click(screen.getByText("Open"));
    const content = await screen.findByTestId("popover-content");
    expect(content).toBeInTheDocument();
    expect(screen.getByText("Aligned Content")).toBeInTheDocument();
  });

  it("should work as a controlled component", async () => {
    const onOpenChangeMock = jest.fn();
    const { rerender } = render(
      <TestPopover open={false} onOpenChange={onOpenChangeMock} />
    );

    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    rerender(<TestPopover open={true} onOpenChange={onOpenChangeMock} />);
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });

    await userEvent.keyboard("{escape}");
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);

    rerender(<TestPopover open={false} onOpenChange={onOpenChangeMock} />);
    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });
  });

  it("PopoverTrigger with asChild should render child component", async () => {
    render(
      <TestPopover
        triggerProps={{ asChild: true }}
        triggerText="Custom Button Trigger"
      />
    );
    const customButton = screen.getByRole("button", {
      name: "Custom Button Trigger",
    });
    expect(customButton).toBeInTheDocument();

    await userEvent.click(customButton);
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });
  });
});
