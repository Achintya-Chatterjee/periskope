import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DialogProps,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";

if (typeof window !== "undefined") {
  Element.prototype.scrollIntoView = jest.fn();
}

const SimpleCommand = ({
  value,
  onValueChange,
  label = "Command Menu",
}: {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
}) => (
  <Command
    value={value}
    onValueChange={onValueChange}
    data-testid="command-root"
    shouldFilter={true}
    aria-label={label}
  >
    <CommandInput placeholder="Search..." data-testid="command-input" />
    <CommandList data-testid="command-list">
      <CommandEmpty data-testid="command-empty">No results found.</CommandEmpty>
      <CommandGroup heading="Fruits" data-testid="group-fruits">
        <CommandItem value="apple" data-testid="item-apple">
          Apple
        </CommandItem>
        <CommandItem value="banana" data-testid="item-banana">
          Banana
        </CommandItem>
      </CommandGroup>
      <CommandSeparator data-testid="command-separator" />
      <CommandGroup heading="Colors" data-testid="group-colors">
        <CommandItem value="red" data-testid="item-red">
          Red
        </CommandItem>
        <CommandItem value="blue" data-testid="item-blue" disabled>
          Blue (Disabled)
        </CommandItem>
        <CommandItem value="green" data-testid="item-green">
          Green<CommandShortcut>CTRL+G</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

interface ControlledCommandProps {
  initialValue?: string;
  onValueChangeMock: jest.Mock;
}
const ControlledSimpleCommandWrapper: React.FC<ControlledCommandProps> = ({
  initialValue,
  onValueChangeMock,
}) => {
  const [value, setValue] = React.useState<string | undefined>(initialValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChangeMock(newValue);
  };

  return <SimpleCommand value={value} onValueChange={handleValueChange} />;
};

describe("Command Components", () => {
  describe("Core Command Functionality", () => {
    it("should render CommandInput, CommandList, CommandGroup, CommandItem, CommandSeparator", () => {
      render(<ControlledSimpleCommandWrapper onValueChangeMock={jest.fn()} />);
      expect(screen.getByTestId("command-input")).toBeInTheDocument();
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
      expect(screen.getByTestId("group-fruits")).toBeInTheDocument();
      expect(screen.getByTestId("item-apple")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByTestId("command-separator")).toBeInTheDocument();
      expect(screen.getByTestId("group-colors")).toBeInTheDocument();
      expect(screen.getByTestId("item-red")).toBeInTheDocument();
      expect(screen.getByText("Red")).toBeInTheDocument();
      expect(screen.getByText("CTRL+G")).toBeInTheDocument();
    });

    it("should filter items based on input", async () => {
      render(<ControlledSimpleCommandWrapper onValueChangeMock={jest.fn()} />);
      const input = screen.getByTestId("command-input");
      await userEvent.type(input, "Apple");

      await waitFor(() => {
        expect(screen.getByTestId("item-apple")).toBeVisible();
        expect(screen.queryByTestId("item-banana")).not.toBeInTheDocument();
        expect(screen.queryByTestId("item-red")).not.toBeInTheDocument();
      });
    });

    it("should display CommandEmpty when no results match", async () => {
      render(<ControlledSimpleCommandWrapper onValueChangeMock={jest.fn()} />);
      const input = screen.getByTestId("command-input");
      await userEvent.type(input, "NonExistent");

      await waitFor(() => {
        expect(screen.getByTestId("command-empty")).toBeVisible();
        expect(screen.getByText("No results found.")).toBeVisible();
        expect(screen.queryByTestId("item-apple")).not.toBeInTheDocument();
      });
    });

    it("should allow item selection with keyboard (ArrowDown, Enter)", async () => {
      const onValueChangeMock = jest.fn();
      render(
        <ControlledSimpleCommandWrapper
          initialValue="apple"
          onValueChangeMock={onValueChangeMock}
        />
      );

      const input = screen.getByTestId("command-input");
      input.focus();

      await waitFor(() =>
        expect(screen.getByTestId("item-apple")).toHaveAttribute(
          "aria-selected",
          "true"
        )
      );

      await userEvent.keyboard("{ArrowDown}");

      await waitFor(() =>
        expect(onValueChangeMock).toHaveBeenCalledWith("banana")
      );

      await waitFor(() =>
        expect(screen.getByTestId("item-banana")).toHaveAttribute(
          "aria-selected",
          "true"
        )
      );
      await waitFor(() =>
        expect(screen.getByTestId("item-apple")).toHaveAttribute(
          "aria-selected",
          "false"
        )
      );

      await userEvent.keyboard("{Enter}");

      expect(onValueChangeMock).toHaveBeenCalledWith("banana");

      expect(
        onValueChangeMock.mock.calls.filter((call) => call[0] === "banana")
          .length
      ).toBeGreaterThanOrEqual(1);
    });

    it("should select item and call onValueChange on click", async () => {
      const onValueChangeMock = jest.fn();
      render(
        <ControlledSimpleCommandWrapper
          initialValue="apple"
          onValueChangeMock={onValueChangeMock}
        />
      );

      const bananaItem = screen.getByTestId("item-banana");
      await userEvent.click(bananaItem);

      await waitFor(() =>
        expect(onValueChangeMock).toHaveBeenCalledWith("banana")
      );
      await waitFor(() =>
        expect(bananaItem).toHaveAttribute("aria-selected", "true")
      );
      expect(
        onValueChangeMock.mock.calls.filter((call) => call[0] === "banana")
          .length
      ).toBe(1);
    });

    it("should skip disabled items during keyboard navigation and not call onValueChange for disabled", async () => {
      const onValueChangeMock = jest.fn();
      render(
        <ControlledSimpleCommandWrapper
          initialValue="apple"
          onValueChangeMock={onValueChangeMock}
        />
      );

      const input = screen.getByTestId("command-input");
      input.focus();

      await waitFor(() =>
        expect(screen.getByTestId("item-apple")).toHaveAttribute(
          "aria-selected",
          "true"
        )
      );

      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(onValueChangeMock).toHaveBeenCalledWith("banana")
      );

      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(onValueChangeMock).toHaveBeenCalledWith("red")
      );
      const callsBeforeGreen = onValueChangeMock.mock.calls.length;

      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(onValueChangeMock).toHaveBeenCalledWith("green")
      );

      await waitFor(() =>
        expect(screen.getByTestId("item-green")).toHaveAttribute(
          "aria-selected",
          "true"
        )
      );
      expect(screen.getByTestId("item-blue")).toHaveAttribute(
        "aria-selected",
        "false"
      );

      expect(
        onValueChangeMock.mock.calls.some((call) => call[0] === "blue")
      ).toBe(false);
      expect(onValueChangeMock.mock.calls.length).toBe(callsBeforeGreen + 1);

      await userEvent.keyboard("{Enter}");

      expect(
        onValueChangeMock.mock.calls.filter((call) => call[0] === "green")
          .length
      ).toBeGreaterThanOrEqual(1);

      const blueItem = screen.getByTestId("item-blue");
      const callsBeforeClickDisabled = onValueChangeMock.mock.calls.length;
      await userEvent.click(blueItem);
      expect(onValueChangeMock.mock.calls.length).toBe(
        callsBeforeClickDisabled
      );
      expect(blueItem).toHaveAttribute("aria-selected", "false");
    });

    it("CommandItem should have correct data attributes (initial auto-selection)", async () => {
      render(
        <ControlledSimpleCommandWrapper
          initialValue="apple"
          onValueChangeMock={jest.fn()}
        />
      );
      const appleItem = screen.getByTestId("item-apple");
      expect(appleItem).toHaveAttribute("data-disabled", "false");
      await waitFor(() =>
        expect(appleItem).toHaveAttribute("aria-selected", "true")
      );
    });
  });

  describe("CommandDialog", () => {
    const TestCommandDialog = ({
      initialOpen = false,
      ...dialogProps
    }: Partial<DialogProps> & { initialOpen?: boolean }) => {
      const [value, setValue] = React.useState<string | undefined>("apple");
      const handleValueChange = jest.fn((newValue: string) => {
        setValue(newValue);
      });

      return (
        <CommandDialog open={initialOpen} {...dialogProps}>
          <VisuallyHidden>
            <DialogTitle>Test Command Dialog</DialogTitle>
            <DialogDescription>
              A dialog for testing command component.
            </DialogDescription>
          </VisuallyHidden>
          <SimpleCommand
            value={value}
            onValueChange={handleValueChange}
            label="Dialog Command Menu"
          />
        </CommandDialog>
      );
    };

    it("should not render dialog content initially if not open", () => {
      render(<TestCommandDialog />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("command-root")).not.toBeInTheDocument();
    });

    it("should render dialog and command content when open", async () => {
      render(<TestCommandDialog initialOpen={true} />);
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      );
      expect(screen.getByText("Test Command Dialog")).toBeInTheDocument();
      expect(screen.getByTestId("command-root")).toBeInTheDocument();
      expect(screen.getByTestId("command-input")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByTestId("item-apple")).toHaveAttribute(
          "aria-selected",
          "true"
        )
      );
    });

    it("should be controllable via open and onOpenChange props", async () => {
      const onOpenChange = jest.fn();
      let currentOpenState = false;
      const { rerender } = render(
        <TestCommandDialog
          open={currentOpenState}
          onOpenChange={onOpenChange}
        />
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      currentOpenState = true;
      rerender(
        <TestCommandDialog
          open={currentOpenState}
          onOpenChange={onOpenChange}
        />
      );
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      );
      expect(screen.getByTestId("command-root")).toBeInTheDocument();
    });
  });
});
