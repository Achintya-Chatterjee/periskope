import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
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

const TestDropdownMenu = ({
  onItemSelect,
  onCheckboxChange,
  checkboxChecked = false,
  radioValue,
  onRadioValueChange,
}: {
  onItemSelect?: (item: string) => void;
  onCheckboxChange?: (checked: boolean) => void;
  checkboxChecked?: boolean;
  radioValue?: string;
  onRadioValueChange?: (value: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger data-testid="dropdown-trigger">
      Open Menu
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent data-testid="dropdown-content" sideOffset={5}>
        <DropdownMenuLabel data-testid="label-profile">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator data-testid="separator-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            data-testid="item-profile"
            onSelect={() => onItemSelect?.("profile")}
          >
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="item-billing"
            onSelect={() => onItemSelect?.("billing")}
            disabled
          >
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="item-settings"
            onSelect={() => onItemSelect?.("settings")}
          >
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator data-testid="separator-2" />
        <DropdownMenuCheckboxItem
          data-testid="checkbox-notifications"
          checked={checkboxChecked}
          onCheckedChange={onCheckboxChange}
        >
          Notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator data-testid="separator-3" />
        <DropdownMenuRadioGroup
          value={radioValue}
          onValueChange={onRadioValueChange}
        >
          <DropdownMenuLabel data-testid="label-view">
            View Mode
          </DropdownMenuLabel>
          <DropdownMenuRadioItem data-testid="radio-compact" value="compact">
            Compact
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            data-testid="radio-comfortable"
            value="comfortable"
          >
            Comfortable
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator data-testid="separator-4" />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger data-testid="subtrigger-share">
            Share
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent data-testid="subcontent-share">
              <DropdownMenuItem
                data-testid="subitem-email"
                onSelect={() => onItemSelect?.("share-email")}
              >
                Email
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="subitem-sms"
                onSelect={() => onItemSelect?.("share-sms")}
              >
                SMS
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          data-testid="item-logout"
          onSelect={() => onItemSelect?.("logout")}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenu>
);

describe("DropdownMenu Components", () => {
  test("should render trigger and not show content initially", () => {
    render(<TestDropdownMenu />);
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
  });

  test("should open and close menu on trigger click", async () => {
    render(<TestDropdownMenu />);
    const trigger = screen.getByTestId("dropdown-trigger");

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await waitFor(() =>
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    );
  });

  test("should close menu on Escape key press", async () => {
    render(<TestDropdownMenu />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    );
  });

  test("DropdownMenuItem should be interactive and handle onSelect", async () => {
    const onItemSelectMock = jest.fn();
    render(<TestDropdownMenu onItemSelect={onItemSelectMock} />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    const profileItem = screen.getByTestId("item-profile");
    await userEvent.click(profileItem);

    expect(onItemSelectMock).toHaveBeenCalledWith("profile");
    await waitFor(() =>
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    );
  });

  test("DropdownMenuItem should handle disabled state", async () => {
    const onItemSelectMock = jest.fn();
    render(<TestDropdownMenu onItemSelect={onItemSelectMock} />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    const billingItem = screen.getByTestId("item-billing");
    expect(billingItem).toHaveAttribute("data-disabled");

    expect(billingItem).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(billingItem, { pointerEventsCheck: 0 });
    expect(onItemSelectMock).not.toHaveBeenCalledWith("billing");

    expect(screen.getByTestId("dropdown-content")).toBeVisible();
  });

  test("DropdownMenuCheckboxItem should toggle checked state", async () => {
    const onCheckboxChangeMock = jest.fn();
    const Wrapper = () => {
      const [checked, setChecked] = React.useState(false);
      const handleCheckedChange = (newChecked: boolean) => {
        setChecked(newChecked);
        onCheckboxChangeMock(newChecked);
      };
      return (
        <TestDropdownMenu
          checkboxChecked={checked}
          onCheckboxChange={handleCheckedChange}
        />
      );
    };
    render(<Wrapper />);
    const trigger = screen.getByTestId("dropdown-trigger");

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    let checkboxItem = screen.getByTestId("checkbox-notifications");
    expect(checkboxItem).toHaveAttribute("aria-checked", "false");

    await userEvent.click(checkboxItem);
    await waitFor(() =>
      expect(onCheckboxChangeMock).toHaveBeenCalledWith(true)
    );

    await waitFor(() =>
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    );

    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );
    checkboxItem = screen.getByTestId("checkbox-notifications");
    expect(checkboxItem).toHaveAttribute("aria-checked", "true");

    checkboxItem = screen.getByTestId("checkbox-notifications");
    await userEvent.click(checkboxItem);
    await waitFor(() => expect(onCheckboxChangeMock).toHaveBeenCalledTimes(2));
    expect(onCheckboxChangeMock).toHaveBeenLastCalledWith(false);

    await waitFor(() =>
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument()
    );

    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );
    checkboxItem = screen.getByTestId("checkbox-notifications");
    expect(checkboxItem).toHaveAttribute("aria-checked", "false");
  });

  test("DropdownMenuRadioGroup and RadioItem should manage selection", async () => {
    const onRadioValueChangeMock = jest.fn();
    const Wrapper = () => {
      const [value, setValue] = React.useState("compact");
      const handleValueChange = (newValue: string) => {
        setValue(newValue);
        onRadioValueChangeMock(newValue);
      };
      return (
        <TestDropdownMenu
          radioValue={value}
          onRadioValueChange={handleValueChange}
        />
      );
    };
    render(<Wrapper />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    const radioCompact = screen.getByTestId("radio-compact");
    const radioComfortable = screen.getByTestId("radio-comfortable");

    expect(radioCompact).toHaveAttribute("aria-checked", "true");
    expect(radioComfortable).toHaveAttribute("aria-checked", "false");

    await userEvent.click(radioComfortable);
    await waitFor(() =>
      expect(onRadioValueChangeMock).toHaveBeenCalledWith("comfortable")
    );
    expect(radioCompact).toHaveAttribute("aria-checked", "false");
    expect(radioComfortable).toHaveAttribute("aria-checked", "true");
  });

  test("DropdownMenuSub should open and allow item selection", async () => {
    const onItemSelectMock = jest.fn();
    render(<TestDropdownMenu onItemSelect={onItemSelectMock} />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    const subTrigger = screen.getByTestId("subtrigger-share");

    await userEvent.click(subTrigger);
    await waitFor(() =>
      expect(screen.getByTestId("subcontent-share")).toBeVisible()
    );

    const subItemEmail = screen.getByTestId("subitem-email");
    await userEvent.click(subItemEmail);

    expect(onItemSelectMock).toHaveBeenCalledWith("share-email");

    await waitFor(() => {
      expect(screen.queryByTestId("subcontent-share")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
    });
  });

  test("DropdownMenuLabel, Separator, Shortcut render correctly", async () => {
    render(<TestDropdownMenu />);
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    await waitFor(() =>
      expect(screen.getByTestId("dropdown-content")).toBeVisible()
    );

    expect(screen.getByTestId("label-profile")).toBeInTheDocument();
    expect(screen.getByTestId("label-profile")).toHaveTextContent("My Account");
    expect(screen.getByTestId("separator-1")).toBeInTheDocument();
    expect(screen.getByText("⇧⌘P")).toBeInTheDocument();
  });

  test("should correctly pass classNames to components", () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuContent className="custom-content" data-testid="content">
          <DropdownMenuItem className="custom-item" data-testid="item">
            Item
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            className="custom-checkbox"
            data-testid="checkbox"
            checked
          >
            Checkbox
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem
              className="custom-radio"
              data-testid="radio"
              value="a"
            >
              Radio
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuLabel className="custom-label" data-testid="label">
            Label
          </DropdownMenuLabel>
          <DropdownMenuSeparator
            className="custom-separator"
            data-testid="separator"
          />
          <DropdownMenuShortcut
            className="custom-shortcut"
            data-testid="shortcut"
          >
            Shortcut
          </DropdownMenuShortcut>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="custom-subtrigger"
              data-testid="subtrigger"
            >
              Sub
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className="custom-subcontent"
                data-testid="subcontent"
              >
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("content")).toHaveClass("custom-content");
    expect(screen.getByTestId("item")).toHaveClass("custom-item");
    expect(screen.getByTestId("checkbox")).toHaveClass("custom-checkbox");
    expect(screen.getByTestId("radio")).toHaveClass("custom-radio");
    expect(screen.getByTestId("label")).toHaveClass("custom-label");
    expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
    expect(screen.getByTestId("shortcut")).toHaveClass("custom-shortcut");
    expect(screen.getByTestId("subtrigger")).toHaveClass("custom-subtrigger");
  });
});
