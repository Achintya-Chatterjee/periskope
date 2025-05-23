import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
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

describe("ContextMenu Components", () => {
  const TestContextMenu = ({
    checkboxChecked,
    onCheckboxChange,
    radioValue,
    onRadioValueChange,
  }: {
    checkboxChecked?: boolean;
    onCheckboxChange?: (checked: boolean) => void;
    radioValue?: string;
    onRadioValueChange?: (value: string) => void;
  }) => (
    <ContextMenu>
      <ContextMenuTrigger data-testid="context-trigger">
        Right click me
      </ContextMenuTrigger>
      <ContextMenuContent data-testid="context-content">
        <ContextMenuItem data-testid="item-view" onSelect={() => alert("View")}>
          View
        </ContextMenuItem>
        <ContextMenuItem data-testid="item-edit" disabled>
          Edit (Disabled)
        </ContextMenuItem>
        <ContextMenuSeparator data-testid="separator-1" />
        <ContextMenuCheckboxItem
          data-testid="checkbox-item"
          checked={checkboxChecked}
          onCheckedChange={onCheckboxChange}
        >
          Show Hidden Files
          <ContextMenuShortcut>⌘H</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator data-testid="separator-2" />
        <ContextMenuGroup data-testid="group-1">
          <ContextMenuLabel data-testid="label-sort">Sort By</ContextMenuLabel>
          <ContextMenuRadioGroup
            value={radioValue}
            onValueChange={onRadioValueChange}
            data-testid="radio-group"
          >
            <ContextMenuRadioItem value="name" data-testid="radio-name">
              Name
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="date" data-testid="radio-date">
              Date
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              value="size"
              data-testid="radio-size"
              disabled
            >
              Size (Disabled)
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator data-testid="separator-3" />
        <ContextMenuSub>
          <ContextMenuSubTrigger data-testid="sub-trigger-share">
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent data-testid="sub-content-share">
            <ContextMenuItem data-testid="item-mail">Mail</ContextMenuItem>
            <ContextMenuItem data-testid="item-messages">
              Messages
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem data-testid="item-more">More...</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem data-testid="item-delete">
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );

  const openContextMenu = async () => {
    const trigger = screen.getByTestId("context-trigger");
    fireEvent.contextMenu(trigger);
    await waitFor(() =>
      expect(screen.getByTestId("context-content")).toBeVisible()
    );
  };

  test("should render ContextMenuTrigger", () => {
    render(<TestContextMenu />);
    expect(screen.getByTestId("context-trigger")).toBeInTheDocument();
    expect(screen.getByText("Right click me")).toBeInTheDocument();
    expect(screen.queryByTestId("context-content")).not.toBeInTheDocument();
  });

  test("should open ContextMenuContent on right click (contextmenu event)", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    expect(screen.getByTestId("context-content")).toBeVisible();
    expect(screen.getByTestId("item-view")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-item")).toBeInTheDocument();
    expect(screen.getByTestId("radio-name")).toBeInTheDocument();
    expect(screen.getByTestId("sub-trigger-share")).toBeInTheDocument();
    expect(screen.getByTestId("label-sort")).toBeInTheDocument();
    expect(screen.getByTestId("separator-1")).toBeInTheDocument();
    expect(screen.getByText("⌘H")).toBeInTheDocument();
  });

  test("ContextMenuCheckboxItem should toggle checked state", async () => {
    const onCheckboxChangeMock = jest.fn();
    const Wrapper = () => {
      const [checked, setChecked] = React.useState(false);
      const handleChange = (newChecked: boolean) => {
        setChecked(newChecked);
        onCheckboxChangeMock(newChecked);
      };
      return (
        <TestContextMenu
          checkboxChecked={checked}
          onCheckboxChange={handleChange}
        />
      );
    };
    render(<Wrapper />);
    await openContextMenu();

    const checkboxItem = screen.getByTestId("checkbox-item");
    expect(checkboxItem).toHaveAttribute("aria-checked", "false");

    await userEvent.click(checkboxItem);
    await openContextMenu();
    await waitFor(() =>
      expect(onCheckboxChangeMock).toHaveBeenCalledWith(true)
    );
    expect(screen.getByTestId("checkbox-item")).toHaveAttribute(
      "aria-checked",
      "true"
    );

    await userEvent.click(screen.getByTestId("checkbox-item"));
    await openContextMenu();
    await waitFor(() =>
      expect(onCheckboxChangeMock).toHaveBeenCalledWith(false)
    );
    expect(screen.getByTestId("checkbox-item")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  test("ContextMenuSub, ContextMenuSubTrigger, and ContextMenuSubContent should work", async () => {
    render(<TestContextMenu />);
    await openContextMenu();

    const subTrigger = screen.getByTestId("sub-trigger-share");
    expect(screen.queryByTestId("sub-content-share")).not.toBeInTheDocument();
    await userEvent.hover(subTrigger);

    await waitFor(
      () => {
        expect(subTrigger).toHaveAttribute("data-state", "open");
      },
      { timeout: 2000 }
    );

    const subContent = screen.getByTestId("sub-content-share");
    expect(subContent).toBeVisible();
    expect(screen.getByTestId("item-mail")).toBeInTheDocument();
    expect(screen.getByTestId("item-messages")).toBeInTheDocument();

    const mailItem = screen.getByTestId("item-mail");
    await userEvent.click(mailItem);

    await waitFor(() => {
      expect(screen.queryByTestId("sub-content-share")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("context-content")).not.toBeInTheDocument();
    });
  });

  test("ContextMenuShortcut should render text", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    expect(screen.getByText("⌘H")).toBeInTheDocument();
    expect(screen.getByText("⌘H")).toHaveClass(
      "ml-auto text-xs tracking-widest text-muted-foreground"
    );
    expect(screen.getByText("⌘⌫")).toBeInTheDocument();
  });

  test("ContextMenuLabel should render text", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    const label = screen.getByTestId("label-sort");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Sort By");
    expect(label).toHaveClass("font-semibold text-foreground");
  });

  test("ContextMenuSeparator should render", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    const separators = screen.getAllByRole("separator");
    expect(separators.length).toBeGreaterThanOrEqual(3);
    separators.forEach((sep) => {
      expect(sep).toHaveClass("-mx-1 my-1 h-px bg-border");
    });
  });

  test("ContextMenuGroup should group items", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    const group = screen.getByTestId("group-1");
    expect(group).toBeInTheDocument();

    expect(group.contains(screen.getByTestId("label-sort"))).toBe(true);
    expect(group.contains(screen.getByTestId("radio-name"))).toBe(true);
  });

  test("should close context menu on Escape key press", async () => {
    render(<TestContextMenu />);
    await openContextMenu();
    expect(screen.getByTestId("context-content")).toBeVisible();

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("context-content")).not.toBeInTheDocument();
    });
  });

  test("should close context menu when clicking outside", async () => {
    render(
      <div>
        <TestContextMenu />
        <button data-testid="outside-button">Click Outside</button>
      </div>
    );
    await openContextMenu();
    expect(screen.getByTestId("context-content")).toBeVisible();

    const outsideButton = screen.getByTestId("outside-button");

    document.body.style.pointerEvents = "auto";
    await userEvent.click(outsideButton);

    await waitFor(() => {
      expect(screen.queryByTestId("context-content")).not.toBeInTheDocument();
    });
  });
});
