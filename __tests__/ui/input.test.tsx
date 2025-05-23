import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("should render an input element", () => {
    render(<Input />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("should apply the correct type attribute", () => {
    const { container } = render(<Input type="password" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const inputElement = container.querySelector('input[type="password"]');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "password");
  });

  it("should apply custom className alongside default classes", () => {
    const customClass = "my-custom-input";
    render(<Input className={customClass} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveClass("flex");
    expect(inputElement).toHaveClass("h-10");
    expect(inputElement).toHaveClass(customClass);
  });

  it("should forward ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("should display placeholder text", () => {
    const placeholderText = "Enter your name";
    render(<Input placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it("should allow value to be set and changed", async () => {
    const initialValue = "Initial Text";
    const typedValue = "New Text";
    const handleChange = jest.fn();

    render(
      <Input
        defaultValue={initialValue}
        onChange={handleChange}
        data-testid="input-uncontrolled"
      />
    );
    const inputElementUncontrolled = screen.getByTestId(
      "input-uncontrolled"
    ) as HTMLInputElement;
    expect(inputElementUncontrolled.value).toBe(initialValue);
    await userEvent.clear(inputElementUncontrolled);
    await userEvent.type(inputElementUncontrolled, typedValue);

    expect(inputElementUncontrolled.value).toBe(typedValue);

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: typedValue }),
      })
    );

    handleChange.mockClear();

    const ControlledInput = () => {
      const [value, setValue] = React.useState(initialValue);
      return (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleChange(e);
          }}
          data-testid="controlled-input"
        />
      );
    };
    const { rerender } = render(<ControlledInput />);

    let controlledInputElement = screen.getByTestId(
      "controlled-input"
    ) as HTMLInputElement;
    expect(controlledInputElement.value).toBe(initialValue);

    await userEvent.clear(controlledInputElement);

    rerender(<ControlledInput />);
    controlledInputElement = screen.getByTestId(
      "controlled-input"
    ) as HTMLInputElement;

    await userEvent.type(controlledInputElement, typedValue);

    rerender(<ControlledInput />);
    controlledInputElement = screen.getByTestId(
      "controlled-input"
    ) as HTMLInputElement;
    expect(controlledInputElement.value).toBe(typedValue);
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: typedValue }),
      })
    );
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveClass("disabled:cursor-not-allowed");
    expect(inputElement).toHaveClass("disabled:opacity-50");
  });

  it("should pass through other HTML input attributes", () => {
    render(
      <Input data-testid="my-input" aria-label="Test Input" name="testName" />
    );
    const inputElement = screen.getByTestId("my-input");
    expect(inputElement).toHaveAttribute("aria-label", "Test Input");
    expect(inputElement).toHaveAttribute("name", "testName");
  });
});
