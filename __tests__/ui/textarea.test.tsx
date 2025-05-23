import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
  cn: jest.fn((...inputs) =>
    inputs
      .flat(Infinity)
      .filter(
        (input) =>
          typeof input === "string" ||
          (typeof input === "object" && input !== null)
      )
      .map((input) => {
        if (
          typeof input === "object" &&
          input !== null &&
          !Array.isArray(input)
        ) {
          return Object.entries(input)
            .filter(([_key, value]) => Boolean(value))
            .map(([key, _value]) => key)
            .join(" ");
        }
        return String(input);
      })
      .filter(
        (input) =>
          input &&
          input !== "null" &&
          input !== "undefined" &&
          input.trim() !== ""
      )
      .join(" ")
  ),
}));

describe("Textarea Component", () => {
  it("should render a textarea element", () => {
    render(<Textarea data-testid="my-textarea" />);
    const textareaElement = screen.getByTestId("my-textarea");
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement.tagName).toBe("TEXTAREA");
  });

  it("should apply custom className alongside default classes", () => {
    const customClass = "my-custom-textarea";
    render(<Textarea className={customClass} data-testid="my-textarea" />);
    const textareaElement = screen.getByTestId("my-textarea");
    expect(textareaElement).toHaveClass("flex");
    expect(textareaElement).toHaveClass("min-h-[80px]");
    expect(textareaElement).toHaveClass(customClass);
  });

  it("should forward ref to the underlying textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("should display placeholder text", () => {
    const placeholderText = "Enter your bio";
    render(<Textarea placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it("should allow value to be set (controlled) and changed", async () => {
    const handleChange = jest.fn();
    let value = "Initial Text";
    const TestControlledTextarea = () => {
      const [val, setVal] = React.useState(value);
      const RerenderTextarea = (
        <Textarea
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            handleChange(e);
          }}
          data-testid="my-textarea"
        />
      );
      React.useEffect(() => {
        value = val;
      }, [val]);
      return RerenderTextarea;
    };
    const { rerender } = render(<TestControlledTextarea />);

    let textareaElement = screen.getByTestId(
      "my-textarea"
    ) as HTMLTextAreaElement;
    expect(textareaElement.value).toBe("Initial Text");

    const typedText = " More";

    await userEvent.type(textareaElement, typedText);

    expect(handleChange).toHaveBeenCalled();

    expect(handleChange.mock.calls.length).toBe(typedText.length);
    textareaElement = screen.getByTestId("my-textarea") as HTMLTextAreaElement;
    expect(textareaElement.value).toBe("Initial Text More");
  });

  it("should handle defaultValue (uncontrolled)", async () => {
    const initialValue = "Default Text";
    render(<Textarea defaultValue={initialValue} data-testid="my-textarea" />);
    const textareaElement = screen.getByTestId(
      "my-textarea"
    ) as HTMLTextAreaElement;
    expect(textareaElement.value).toBe(initialValue);

    await userEvent.type(textareaElement, " Appended");
    expect(textareaElement.value).toBe("Default Text Appended");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Textarea disabled data-testid="my-textarea" />);
    const textareaElement = screen.getByTestId("my-textarea");
    expect(textareaElement).toBeDisabled();
    expect(textareaElement).toHaveClass("disabled:cursor-not-allowed");
    expect(textareaElement).toHaveClass("disabled:opacity-50");
  });

  it("should pass through other HTML textarea attributes like rows and cols", () => {
    render(
      <Textarea data-testid="my-textarea" rows={5} cols={30} name="bio" />
    );
    const textareaElement = screen.getByTestId("my-textarea");
    expect(textareaElement).toHaveAttribute("rows", "5");
    expect(textareaElement).toHaveAttribute("cols", "30");
    expect(textareaElement).toHaveAttribute("name", "bio");
  });

  it("should call onChange prop when text is entered", async () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="my-textarea" />);
    const textareaElement = screen.getByTestId("my-textarea");
    await userEvent.type(textareaElement, "test");
    expect(handleChange).toHaveBeenCalledTimes(4);
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "test" }),
      })
    );
  });
});
