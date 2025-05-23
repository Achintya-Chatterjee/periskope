import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  ChevronDown: (props: any) => (
    <svg data-testid="chevron-down-icon" {...props} />
  ),
}));

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

describe("NavigationMenu Component", () => {
  const TestNavigationMenu = () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="item1">
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="item2">
          <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ListItem href="/docs/primitives/typography" title="Typography">
              Styles for headings, paragraphs, lists...etc
            </ListItem>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/docs"
            className={navigationMenuTriggerStyle()}
          >
            Direct Link
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  );

  it("should render NavigationMenu with triggers and viewport", () => {
    render(<TestNavigationMenu />);
    expect(screen.getByText("Item One")).toBeInTheDocument();
    expect(screen.getByText("Item Two")).toBeInTheDocument();
    const viewportWrapper = screen.getByTestId("viewport-wrapper");
    expect(viewportWrapper).toBeInTheDocument();
  });

  it("NavigationMenuTrigger should open NavigationMenuContent on hover/focus", async () => {
    render(<TestNavigationMenu />);
    const triggerOne = screen.getByText("Item One");
    const user = userEvent.setup();

    expect(screen.queryByText("shadcn/ui")).not.toBeInTheDocument();

    await user.hover(triggerOne);

    await waitFor(() => {
      expect(screen.getByText("shadcn/ui")).toBeInTheDocument();
    });

    expect(triggerOne).toHaveAttribute("aria-expanded", "true");
    expect(triggerOne).toHaveAttribute("data-state", "open");
    expect(
      triggerOne.querySelector("[data-testid='chevron-down-icon']")
    ).toBeInTheDocument();
  });

  it("NavigationMenuLink should render as an anchor tag", async () => {
    render(<TestNavigationMenu />);
    const triggerOne = screen.getByText("Item One");
    const user = userEvent.setup();
    await user.hover(triggerOne);

    const link = await screen.findByText("shadcn/ui");
    // eslint-disable-next-line testing-library/no-node-access
    const anchorElement = link.closest("a");
    expect(anchorElement).toBeInTheDocument();
    expect(anchorElement).toHaveAttribute("href", "/");
  });

  it("NavigationMenuViewport should be present and contain content when open", async () => {
    render(<TestNavigationMenu />);
    const triggerOne = screen.getByText("Item One");
    const user = userEvent.setup();
    await user.hover(triggerOne);

    await waitFor(() => {
      const viewportWrapper = screen.getByTestId("viewport-wrapper");
      // eslint-disable-next-line testing-library/no-node-access
      const viewportPrimitive = viewportWrapper.firstChild as HTMLElement;
      expect(viewportPrimitive).toBeInTheDocument();
      expect(viewportPrimitive).toHaveAttribute("data-state", "open");
      expect(screen.getByText("shadcn/ui")).toBeInTheDocument();
    });
  });

  it("navigationMenuTriggerStyle should apply correct classes", () => {
    render(
      <button className={cn(navigationMenuTriggerStyle())}>Test Button</button>
    );
    const button = screen.getByText("Test Button");
    expect(button).toHaveClass(
      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium"
    );
  });

  it("NavigationMenu should forward ref", () => {
    const ref = React.createRef<HTMLElement>();
    render(<NavigationMenu ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);

    expect(ref.current?.tagName).toBe("NAV");
  });

  it("NavigationMenuList should forward ref", () => {
    const ref = React.createRef<HTMLUListElement>();
    render(
      <NavigationMenu>
        <NavigationMenuList ref={ref} />
      </NavigationMenu>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it("NavigationMenuTrigger should forward ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger ref={ref}>Trigger</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("NavigationMenuContent should forward ref", async () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Trigger</NavigationMenuTrigger>
            <NavigationMenuContent ref={ref}>
              <p>Content</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    const user = userEvent.setup();

    const trigger = screen.getByText("Trigger");
    await user.hover(trigger);

    await waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement));
  });
});
