import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label Component", () => {
  it("should render a label element with its children", () => {
    const labelText = "Username";
    render(<Label>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();

    expect(labelElement.tagName).toBe("LABEL");
  });

  it("should apply default label variants", () => {
    const labelText = "Test Label";
    render(<Label>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass("font-medium");
    expect(labelElement).toHaveClass("leading-none");
    expect(labelElement).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(labelElement).toHaveClass("peer-disabled:opacity-70");
  });

  it("should apply custom className alongside default variants", () => {
    const labelText = "Custom Class Label";
    const customClass = "my-custom-label";
    render(<Label className={customClass}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass(customClass);
  });

  it("should forward ref to the underlying Radix LabelPrimitive.Root element", () => {
    const labelText = "Ref Label";
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>{labelText}</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current?.tagName).toBe("LABEL");
  });

  it("should pass through HTML attributes like htmlFor", () => {
    const labelText = "Email";
    const inputId = "email-input";
    render(<Label htmlFor={inputId}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveAttribute("for", inputId);
  });

  it("should render correctly with no children if needed (though unusual for label)", () => {
    const { container } = render(<Label data-testid="empty-label" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const labelElement = container.querySelector(
      "label[data-testid='empty-label']"
    );
    expect(labelElement).toBeInTheDocument();
  });
});
