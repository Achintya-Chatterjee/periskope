import { render, screen, fireEvent } from "@testing-library/react";
import { Button, ButtonProps } from "@/components/ui/button";

describe("Button Component", () => {
  test("should renders children correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("should handles onClick event", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("should applies default variant and size classes", () => {
    const { container } = render(<Button>Default</Button>);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const buttonElement = container.firstChild;
    expect(buttonElement).toHaveClass("bg-primary text-primary-foreground");
    expect(buttonElement).toHaveClass("h-10 px-4 py-2");
  });

  test.each([
    ["destructive", "bg-destructive text-destructive-foreground"],
    ["outline", "border border-input bg-background"],
    ["secondary", "bg-secondary text-secondary-foreground"],
    ["ghost", "hover:bg-accent hover:text-accent-foreground"],
    ["link", "text-primary underline-offset-4 hover:underline"],
  ])("applies correct classes for variant: %s", (variant, expectedClasses) => {
    const { container } = render(
      <Button variant={variant as ButtonProps["variant"]}>Variant Test</Button>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const buttonElement = container.firstChild;
    expectedClasses.split(" ").forEach((expectedClass) => {
      expect(buttonElement).toHaveClass(expectedClass);
    });
  });

  test.each([
    ["sm", "h-9 rounded-md px-3"],
    ["lg", "h-11 rounded-md px-8"],
    ["icon", "h-10 w-10"],
  ])("applies correct classes for size: %s", (size, expectedClasses) => {
    const { container } = render(
      <Button size={size as ButtonProps["size"]}>Size Test</Button>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const buttonElement = container.firstChild;
    expectedClasses.split(" ").forEach((expectedClass) => {
      expect(buttonElement).toHaveClass(expectedClass);
    });
  });

  test("should renders asChild correctly", () => {
    render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>
    );
    const linkElement = screen.getByText("Link Button");
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveClass("bg-primary");
    expect(linkElement).toHaveClass("text-primary-foreground");
  });

  test("should is disabled when disabled prop is true", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    const buttonElement = screen.getByText("Disabled Button");
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
