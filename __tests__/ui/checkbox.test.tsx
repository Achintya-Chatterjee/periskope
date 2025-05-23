import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

describe("Checkbox", () => {
  it("should render correctly", () => {
    render(<Checkbox id="test-checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("should be checkable and uncheckable", () => {
    const handleChange = jest.fn();
    render(<Checkbox id="test-checkbox" onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("should reflect the defaultChecked prop", () => {
    render(<Checkbox id="test-checkbox" defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should reflect the checked prop (controlled)", () => {
    const onCheckedChangeMock = jest.fn();
    const { rerender } = render(
      <Checkbox
        id="test-checkbox"
        checked={true}
        onCheckedChange={onCheckedChangeMock}
      />
    );
    let checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    rerender(
      <Checkbox
        id="test-checkbox"
        checked={false}
        onCheckedChange={onCheckedChangeMock}
      />
    );
    checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should be disabled when the disabled prop is true", () => {
    const handleChange = jest.fn();
    render(
      <Checkbox id="test-checkbox" disabled onCheckedChange={handleChange} />
    );
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should have correct aria-checked attribute", () => {
    render(<Checkbox id="test-checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("should apply custom className", () => {
    render(<Checkbox id="test-checkbox" className="my-custom-class" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("my-custom-class");
  });

  it("should forward ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox id="test-checkbox" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("should render the check icon when checked", () => {
    render(<Checkbox id="test-checkbox" checked onCheckedChange={jest.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.querySelector(".lucide-check")).toBeInTheDocument();
  });

  it("should not render the check icon when not checked", () => {
    render(<Checkbox id="test-checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.querySelector(".lucide-check")).toBeNull();
  });
});
