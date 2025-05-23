import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";

jest.mock("lucide-react", () => ({
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
  ChevronDown: (props: any) => (
    <svg data-testid="chevron-down-icon" {...props} />
  ),
  ChevronUp: (props: any) => <svg data-testid="chevron-up-icon" {...props} />,
}));

let portalContainer: HTMLElement;

beforeEach(() => {
  portalContainer = document.createElement("div");
  portalContainer.id = "portal-container";
  document.body.appendChild(portalContainer);
});

afterEach(() => {
  document.body.removeChild(portalContainer);
});

const TestSelect = ({
  onValueChange,
  value,
  defaultValue,
  placeholder = "Select an item",
  items = [
    { value: "item1", label: "Item 1" },
    { value: "item2", label: "Item 2" },
    { value: "item3", label: "Item 3" },
  ],
  triggerProps,
  contentProps,
  itemProps,
  groupLabel,
}: {
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  items?: Array<{ value: string; label: string; disabled?: boolean }>;
  triggerProps?: Partial<React.ComponentPropsWithoutRef<typeof SelectTrigger>>;
  contentProps?: Partial<React.ComponentPropsWithRef<typeof SelectContent>> & {
    container?: HTMLElement;
  };
  itemProps?: Partial<React.ComponentPropsWithRef<typeof SelectItem>>;
  groupLabel?: string;
}) => (
  <Select
    onValueChange={onValueChange}
    value={value}
    defaultValue={defaultValue}
  >
    <SelectTrigger data-testid="select-trigger" {...triggerProps}>
      <SelectValue placeholder={placeholder} data-testid="select-value" />
    </SelectTrigger>
    <SelectContent
      data-testid="select-content"
      {...contentProps}
      container={contentProps?.container || portalContainer}
    >
      <SelectGroup>
        {groupLabel && (
          <SelectLabel data-testid="select-label">{groupLabel}</SelectLabel>
        )}
        {items.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            data-testid={`select-item-${item.value}`}
            {...itemProps}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

describe("Select Components Suite", () => {
  describe("SelectTrigger", () => {
    it("should render with default classes, children, and icon", () => {
      render(
        <Select>
          <SelectTrigger data-testid="trigger">
            <SelectValue placeholder="Placeholder" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByTestId("trigger");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      );
      expect(screen.getByText("Placeholder")).toBeInTheDocument();
      expect(
        trigger.querySelector('[data-testid="chevron-down-icon"]')
      ).toBeInTheDocument();
    });

    it("should merge className for SelectTrigger", () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger" data-testid="trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      expect(screen.getByTestId("trigger")).toHaveClass("custom-trigger");
    });

    it("should forward ref for SelectTrigger", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Select>
          <SelectTrigger ref={ref}>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <Select>
          <SelectTrigger disabled data-testid="trigger">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByTestId("trigger");
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass(
        "disabled:cursor-not-allowed disabled:opacity-50"
      );
    });
  });

  describe("SelectContent", () => {
    it("should apply popper position classes by default", async () => {
      render(<TestSelect />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const content = await screen.findByTestId("select-content");
      expect(content).toHaveClass("data-[side=bottom]:translate-y-1");
    });

    it("should apply custom position classes", async () => {
      render(<TestSelect contentProps={{ position: "item-aligned" }} />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const content = await screen.findByTestId("select-content");
      expect(content).not.toHaveClass("data-[side=bottom]:translate-y-1");
    });

    it("should merge className for SelectContent", async () => {
      render(<TestSelect contentProps={{ className: "custom-content" }} />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const content = await screen.findByTestId("select-content");
      expect(content).toHaveClass("custom-content");
    });

    it("should forward ref for SelectContent", async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<TestSelect contentProps={{ ref: ref }} />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      await screen.findByTestId("select-content");
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("SelectLabel", () => {
    it("should render with default classes and children", async () => {
      render(<TestSelect groupLabel="Test Label" />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const label = await screen.findByTestId("select-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Test Label");
      expect(label).toHaveClass("py-1.5 pl-8 pr-2 text-sm font-semibold");
    });

    it("should merge className for SelectLabel", async () => {
      render(
        <Select open>
          <SelectContent container={portalContainer} data-testid="content">
            <SelectGroup>
              <SelectLabel className="custom-label" data-testid="direct-label">
                My Direct Label
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      const label = screen.getByTestId("direct-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("custom-label");
    });

    it("should forward ref for SelectLabel", async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Select open>
          <SelectContent container={portalContainer} data-testid="content">
            <SelectGroup>
              <SelectLabel ref={ref} data-testid="direct-label-ref">
                Label with Ref
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      await screen.findByTestId("direct-label-ref");
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("SelectItem", () => {
    it("should render with default classes, children, and item indicator structure", async () => {
      render(<TestSelect />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const item = await screen.findByTestId("select-item-item1");
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent("Item 1");
      expect(item).toHaveClass(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
      );
      const checkIconContainer = item.querySelector("span.absolute.left-2");
      expect(checkIconContainer).toBeInTheDocument();
    });

    it("should show check icon when item is selected", async () => {
      render(<TestSelect defaultValue="item1" />);
      await userEvent.click(screen.getByTestId("select-trigger"));
      const item1 = await screen.findByTestId("select-item-item1");
      expect(
        item1.querySelector('[data-testid="check-icon"]')
      ).toBeInTheDocument();

      const item2 = await screen.findByTestId("select-item-item2");
      expect(
        item2.querySelector('[data-testid="check-icon"]')
      ).not.toBeInTheDocument();
    });

    it("should merge className for SelectItem", async () => {
      render(
        <TestSelect
          items={[{ value: "item1", label: "Item 1" }]}
          itemProps={{ className: "custom-item" }}
        />
      );
      await userEvent.click(screen.getByTestId("select-trigger"));
      const item = await screen.findByTestId("select-item-item1");
      expect(item).toHaveClass("custom-item");
    });

    it("should forward ref for SelectItem", async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <TestSelect
          items={[{ value: "item1", label: "Item 1" }]}
          itemProps={{ ref }}
        />
      );
      await userEvent.click(screen.getByTestId("select-trigger"));
      await screen.findByTestId("select-item-item1");
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should be disabled when disabled prop is true", async () => {
      render(
        <TestSelect
          items={[{ value: "item1", label: "Item 1", disabled: true }]}
        />
      );
      await userEvent.click(screen.getByTestId("select-trigger"));
      const item = await screen.findByTestId("select-item-item1");
      expect(item).toHaveAttribute("data-disabled");
      expect(item).toHaveClass(
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      );
    });
  });

  describe("SelectSeparator", () => {
    it("should render with default classes", async () => {
      render(
        <Select open={true}>
          <SelectContent container={portalContainer} data-testid="content">
            <SelectSeparator data-testid="separator" />
          </SelectContent>
        </Select>
      );
      const separator = screen.getByTestId("separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass("-mx-1 my-1 h-px bg-muted");
    });

    it("should merge className for SelectSeparator", async () => {
      render(
        <Select open={true}>
          <SelectContent container={portalContainer} data-testid="content">
            <SelectSeparator
              className="custom-separator"
              data-testid="separator"
            />
          </SelectContent>
        </Select>
      );
      expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
    });

    it("should forward ref for SelectSeparator", async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Select open={true}>
          <SelectContent container={portalContainer}>
            <SelectSeparator ref={ref} />
          </SelectContent>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Select Integration Tests", () => {
    it("should open content on trigger click and select an item", async () => {
      const handleChange = jest.fn();
      render(<TestSelect onValueChange={handleChange} />);

      const trigger = screen.getByTestId("select-trigger");
      expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();

      await userEvent.click(trigger);
      const content = await screen.findByTestId("select-content");
      expect(content).toBeInTheDocument();

      const item2 = await screen.findByTestId("select-item-item2");
      await userEvent.click(item2);

      expect(handleChange).toHaveBeenCalledWith("item2");
      await waitFor(() => {
        expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 2");
    });

    it("should display placeholder when no value is selected", () => {
      render(<TestSelect placeholder="My Placeholder" />);
      expect(screen.getByTestId("select-value")).toHaveTextContent(
        "My Placeholder"
      );
    });

    it("should work as a controlled component", async () => {
      const ControlledTestSelect = () => {
        const [value, setValue] = React.useState<string | undefined>(undefined);
        return <TestSelect value={value} onValueChange={setValue} />;
      };
      render(<ControlledTestSelect />);

      const trigger = screen.getByTestId("select-trigger");
      await userEvent.click(trigger);

      const item1 = await screen.findByTestId("select-item-item1");
      await userEvent.click(item1);

      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 1");

      await userEvent.click(trigger);
      const item3 = await screen.findByTestId("select-item-item3");
      await userEvent.click(item3);
      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 3");
    });

    it("should work with defaultValue", async () => {
      render(<TestSelect defaultValue="item3" />);
      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 3");

      const trigger = screen.getByTestId("select-trigger");
      await userEvent.click(trigger);

      const item1 = await screen.findByTestId("select-item-item1");
      await userEvent.click(item1);
      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 1");
    });

    it("should not select disabled item", async () => {
      const handleChange = jest.fn();
      render(
        <TestSelect
          items={[
            { value: "item1", label: "Item 1", disabled: true },
            { value: "item2", label: "Item 2" },
          ]}
          onValueChange={handleChange}
        />
      );

      const trigger = screen.getByTestId("select-trigger");
      await userEvent.click(trigger);

      const disabledItem = await screen.findByTestId("select-item-item1");
      await userEvent.click(disabledItem);

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByTestId("select-content")).toBeInTheDocument();

      const enabledItem = await screen.findByTestId("select-item-item2");
      await userEvent.click(enabledItem);

      expect(handleChange).toHaveBeenCalledWith("item2");
      await waitFor(() => {
        expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("select-value")).toHaveTextContent("Item 2");
    });
  });
});
