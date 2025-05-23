import React from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator Component", () => {
  test("should render with default (horizontal) orientation and decorative true", () => {
    const { container } = render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    const primitiveRoot = container.firstChild as HTMLElement;
    expect(primitiveRoot).toHaveAttribute("role", "none");
    expect(primitiveRoot).toHaveAttribute("data-orientation", "horizontal");
    expect(primitiveRoot).not.toHaveAttribute("data-orientation", "vertical");
    expect(primitiveRoot).toHaveClass("h-[1px] w-full");
  });

  test("should render with vertical orientation and decorative true", () => {
    const { container } = render(
      <Separator orientation="vertical" data-testid="separator-vertical" />
    );
    const separator = screen.getByTestId("separator-vertical");
    expect(separator).toBeInTheDocument();
    const primitiveRoot = container.firstChild as HTMLElement;
    expect(primitiveRoot).toHaveAttribute("role", "none");
    expect(primitiveRoot).toHaveAttribute("data-orientation", "vertical");
    expect(primitiveRoot).toHaveClass("h-full w-[1px]");
  });

  test("should apply custom className", () => {
    const { container } = render(
      <Separator
        className="my-custom-separator"
        data-testid="separator-custom"
      />
    );
    const separator = screen.getByTestId("separator-custom");
    expect(separator).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("my-custom-separator");
  });

  test("should render correctly when decorative is false and orientation is horizontal (default)", () => {
    const { container } = render(
      <Separator decorative={false} data-testid="separator-non-decorative" />
    );
    const separator = screen.getByTestId("separator-non-decorative");
    expect(separator).toBeInTheDocument();
    const primitiveRoot = container.firstChild as HTMLElement;
    expect(primitiveRoot).toHaveAttribute("role", "separator");
  });

  test("should render correctly with aria-orientation when decorative is false and orientation is vertical", () => {
    const { container } = render(
      <Separator
        decorative={false}
        orientation="vertical"
        data-testid="separator-non-decorative-vertical"
      />
    );
    const separator = screen.getByTestId("separator-non-decorative-vertical");
    expect(separator).toBeInTheDocument();
    const primitiveRoot = container.firstChild as HTMLElement;
    expect(primitiveRoot).toHaveAttribute("role", "separator");
    expect(primitiveRoot).toHaveAttribute("aria-orientation", "vertical");
  });

  test("should forward ref to the underlying SeparatorPrimitive.Root (decorative true)", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "none");
  });

  test("should forward ref to the underlying SeparatorPrimitive.Root (decorative false)", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} decorative={false} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "separator");
  });

  test("should pass through other props (decorative true)", () => {
    render(<Separator data-foo="bar" data-testid="sep-foo" />);
    const separatorElement = screen.getByTestId("sep-foo");
    expect(separatorElement).toHaveAttribute("data-foo", "bar");
    expect(separatorElement).toHaveAttribute("role", "none");
  });

  test("should pass through other props (decorative false)", () => {
    render(
      <Separator data-foo="bar" decorative={false} data-testid="sep-bar" />
    );
    const separatorElement = screen.getByTestId("sep-bar");
    expect(separatorElement).toHaveAttribute("data-foo", "bar");
    expect(separatorElement).toHaveAttribute("role", "separator");
  });
});
