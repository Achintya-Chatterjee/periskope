import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from "@/components/ui/menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
  ChevronRight: (props: any) => (
    <svg data-testid="chevron-right-icon" {...props} />
  ),
  Circle: (props: any) => <svg data-testid="circle-icon" {...props} />,
}));

describe("Menubar Component", () => {
  const TestMenubar = ({
    onSelectNew = jest.fn(),
    onSelectOpen = jest.fn(),
  }) => (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={onSelectNew}>New Tab</MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarPortal>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                </MenubarSubContent>
              </MenubarPortal>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarRadioGroup value="pedro">
              <MenubarLabel inset>Panel Position</MenubarLabel>
              <MenubarRadioItem value="top">Top</MenubarRadioItem>
              <MenubarRadioItem value="bottom">Bottom</MenubarRadioItem>
              <MenubarRadioItem value="pedro">Pedro</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset onSelect={onSelectOpen}>
              Open File...
            </MenubarItem>
            <MenubarItem disabled>Print</MenubarItem>
            <MenubarShortcut>âP</MenubarShortcut>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );

  it("should render the Menubar with triggers", () => {
    render(<TestMenubar />);
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText("File").closest("[role='menubar']")).toHaveClass(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1"
    );
  });

  it("MenubarTrigger should open MenubarContent on click", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    expect(screen.queryByText("New Tab")).not.toBeInTheDocument();

    await userEvent.click(fileTrigger);
    await waitFor(() => {
      expect(screen.getByText("New Tab")).toBeInTheDocument();
    });

    expect(fileTrigger).toHaveClass(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    );

    expect(screen.getByText("New Tab").closest("[role='menu']")).toHaveClass(
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    );
  });

  it("MenubarItem should be interactive and call onSelect", async () => {
    const onSelectNewMock = jest.fn();
    render(<TestMenubar onSelectNew={onSelectNewMock} />);

    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const newItem = await screen.findByText("New Tab");
    await userEvent.click(newItem);

    expect(onSelectNewMock).toHaveBeenCalledTimes(1);

    expect(newItem).toHaveClass(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    );
  });

  it("MenubarItem should be disabled if disabled prop is set", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const printItem = await screen.findByText("Print");
    expect(printItem).toHaveAttribute("aria-disabled", "true");
    expect(printItem).toHaveClass("data-[disabled]:opacity-50");

    await userEvent.click(printItem);
    expect(screen.getByText("New Tab")).toBeInTheDocument();
  });

  it("MenubarSubTrigger should open MenubarSubContent on click", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const shareSubTrigger = await screen.findByText("Share");
    expect(screen.queryByText("Email link")).not.toBeInTheDocument();

    await userEvent.click(shareSubTrigger);
    await waitFor(() => {
      expect(screen.getByText("Email link")).toBeInTheDocument();
    });

    expect(shareSubTrigger).toHaveClass(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    );
    expect(
      shareSubTrigger.querySelector("[data-testid='chevron-right-icon']")
    ).toBeInTheDocument();

    expect(screen.getByText("Email link").closest("[role='menu']")).toHaveClass(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground"
    );
  });

  it("MenubarCheckboxItem should display check icon when checked", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const showSidebarItem = await screen.findByText("Show Sidebar");
    expect(
      showSidebarItem.querySelector("[data-testid='check-icon']")
    ).toBeInTheDocument();

    expect(showSidebarItem).toHaveClass(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    );
  });

  it("MenubarRadioItem should display circle icon for selected item in a group", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const pedroItem = await screen.findByText("Pedro");
    expect(
      pedroItem.querySelector("[data-testid='circle-icon']")
    ).toBeInTheDocument();

    expect(pedroItem).toHaveClass(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    );
  });

  it("MenubarLabel should render with inset if specified", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);
    const panelLabel = await screen.findByText("Panel Position");
    expect(panelLabel).toHaveClass("pl-8");

    expect(panelLabel).toHaveClass("px-2 py-1.5 text-sm font-semibold");
  });

  it("MenubarItem should render with inset if specified", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);
    const openFileItem = await screen.findByText("Open File...");
    expect(openFileItem).toHaveClass("pl-8");
  });

  it("MenubarSeparator should render", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const content = await screen.findByText("New Tab");
    // eslint-disable-next-line testing-library/no-node-access
    const separator = content
      .closest("[role='menu']")
      ?.querySelector(".-mx-1.my-1.h-px.bg-muted");
    expect(separator).toBeInTheDocument();
  });

  it("MenubarShortcut should render its text", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);
    const shortcut = await screen.findByText("âP");
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass(
      "ml-auto text-xs tracking-widest text-muted-foreground"
    );
  });

  it("should close on Escape key press", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);
    await screen.findByText("New Tab");

    await userEvent.keyboard("{escape}");
    await waitFor(() => {
      expect(screen.queryByText("New Tab")).not.toBeInTheDocument();
    });
  });

  it("should navigate items with arrow keys", async () => {
    render(<TestMenubar />);
    const fileTrigger = screen.getByText("File");
    await userEvent.click(fileTrigger);

    const newItem = await screen.findByText("New Tab");
    const newWindowItem = screen.getByText("New Window");

    act(() => {
      newItem.focus();
    });
    expect(newItem).toHaveFocus();

    await userEvent.keyboard("{arrowdown}");

    expect(newWindowItem).toBeInTheDocument();
  });

  it("Menubar should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Menubar ref={ref}>
        <MenubarMenu>
          <MenubarTrigger>Test</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("MenubarTrigger should forward ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger ref={ref}>Test</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("MenubarContent should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Test</MenubarTrigger>
          <MenubarPortal>
            <MenubarContent ref={ref}>
              <MenubarItem>Item</MenubarItem>
            </MenubarContent>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>
    );

    fireEvent.click(screen.getByText("Test"));
    waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement));
  });

  it("MenubarItem should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Test</MenubarTrigger>
          <MenubarPortal>
            <MenubarContent>
              <MenubarItem ref={ref}>Item</MenubarItem>
            </MenubarContent>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>
    );
    fireEvent.click(screen.getByText("Test"));
    waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement));
  });
});
