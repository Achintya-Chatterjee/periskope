import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toggle, toggleVariants } from "@/components/ui/toggle";

describe("Toggle Component", () => {
  it("should render with default variant and size", () => {
    render(<Toggle data-testid="toggle">Click me</Toggle>);
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(toggle).toHaveClass("bg-transparent");
    expect(toggle).toHaveClass("h-10");
    expect(toggle).toHaveClass("hover:bg-muted");
    expect(toggle).toHaveClass("hover:text-muted-foreground");
  });

  it("should render with outline variant", () => {
    render(
      <Toggle variant="outline" data-testid="toggle">
        Outline
      </Toggle>
    );
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveClass("border-input");
    expect(toggle).toHaveClass("bg-transparent");
    expect(toggle).toHaveClass("hover:bg-accent");
    expect(toggle).toHaveClass("hover:text-accent-foreground");
    expect(toggle).not.toHaveClass("hover:bg-muted");
    expect(toggle).toHaveClass("h-10");
  });

  it("should render with sm size", () => {
    render(
      <Toggle size="sm" data-testid="toggle">
        Small
      </Toggle>
    );
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveClass("h-9");
    expect(toggle).toHaveClass("bg-transparent");
  });

  it("should render with lg size", () => {
    render(
      <Toggle size="lg" data-testid="toggle">
        Large
      </Toggle>
    );
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveClass("h-11");
    expect(toggle).toHaveClass("bg-transparent");
  });

  it("should apply custom className", () => {
    render(
      <Toggle className="custom-toggle" data-testid="toggle">
        Custom
      </Toggle>
    );
    expect(screen.getByTestId("toggle")).toHaveClass("custom-toggle");
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Toggle disabled data-testid="toggle">
        Disabled
      </Toggle>
    );
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toBeDisabled();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("should toggle data-state on click", () => {
    render(<Toggle data-testid="toggle">Toggle Me</Toggle>);
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveAttribute("data-state", "off");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "on");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("should forward ref to TogglePrimitive.Root", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Toggle ref={ref}>Ref Toggle</Toggle>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("should render with specific variant and size combination", () => {
    render(
      <Toggle variant="outline" size="lg" data-testid="toggle">
        Specific
      </Toggle>
    );
    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveClass("border-input");
    expect(toggle).toHaveClass("h-11");
    expect(toggle).toHaveClass("hover:bg-accent");
    expect(toggle).toHaveClass("hover:text-accent-foreground");
    expect(toggle).not.toHaveClass("hover:bg-muted");
    expect(toggle).toHaveClass("bg-transparent");
  });
});
