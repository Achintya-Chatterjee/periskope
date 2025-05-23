import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  Circle: (props: any) => <svg data-testid="circle-icon" {...props} />,
}));

const TestRadioGroup = ({
  radioGroupProps = {},
  item1Props = {},
  item2Props = {},
  item3Props = {},
}) => (
  <RadioGroup {...radioGroupProps}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="r1" {...item1Props} />
      <label htmlFor="r1">Option One</label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="r2" {...item2Props} />
      <label htmlFor="r2">Option Two</label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option3" id="r3" {...item3Props} />
      <label htmlFor="r3">Option Three (Disabled)</label>
    </div>
  </RadioGroup>
);

describe("RadioGroup Component Suite", () => {
  describe("RadioGroup", () => {
    it('should render with role="radiogroup" and default classes', () => {
      render(<RadioGroup data-testid="rg" />);
      const radioGroup = screen.getByTestId("rg");
      expect(radioGroup).toBeInTheDocument();
      expect(radioGroup).toHaveAttribute("role", "radiogroup");
      expect(radioGroup).toHaveClass("grid gap-2");
    });

    it("should merge className for RadioGroup", () => {
      render(<RadioGroup className="custom-rg-class" data-testid="rg" />);
      expect(screen.getByTestId("rg")).toHaveClass("custom-rg-class");
    });

    it("should forward ref for RadioGroup", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<RadioGroup ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should set defaultValue correctly", () => {
      render(<TestRadioGroup radioGroupProps={{ defaultValue: "option2" }} />);
      const optionTwo = screen.getByRole("radio", { name: "Option Two" });
      expect(optionTwo).toHaveAttribute("aria-checked", "true");
      expect(
        optionTwo.querySelector('[data-testid="circle-icon"]')
      ).toBeInTheDocument();
    });

    it("onValueChange should be called when an item is selected", async () => {
      const onValueChangeMock = jest.fn();
      render(
        <TestRadioGroup
          radioGroupProps={{ onValueChange: onValueChangeMock }}
        />
      );
      const optionOneLabel = screen.getByText("Option One");
      await userEvent.click(optionOneLabel);
      expect(onValueChangeMock).toHaveBeenCalledTimes(1);
      expect(onValueChangeMock).toHaveBeenCalledWith("option1");
    });

    it("should work as a controlled component", async () => {
      const onValueChangeMock = jest.fn();
      const { rerender } = render(
        <TestRadioGroup
          radioGroupProps={{
            value: "option1",
            onValueChange: onValueChangeMock,
          }}
        />
      );
      const optionOneItem = screen.getByRole("radio", { name: "Option One" });
      const optionTwoItem = screen.getByRole("radio", { name: "Option Two" });
      const optionTwoLabel = screen.getByText("Option Two");

      expect(optionOneItem).toHaveAttribute("aria-checked", "true");
      expect(optionTwoItem).toHaveAttribute("aria-checked", "false");

      await userEvent.click(optionTwoLabel);
      expect(onValueChangeMock).toHaveBeenCalledWith("option2");

      rerender(
        <TestRadioGroup
          radioGroupProps={{
            value: "option2",
            onValueChange: onValueChangeMock,
          }}
        />
      );
      expect(optionOneItem).toHaveAttribute("aria-checked", "false");
      expect(optionTwoItem).toHaveAttribute("aria-checked", "true");
    });

    it("should disable all items if RadioGroup is disabled", () => {
      render(<TestRadioGroup radioGroupProps={{ disabled: true }} />);
      const items = screen.getAllByRole("radio");
      items.forEach((item) => {
        expect(item).toBeDisabled();
      });
    });
  });

  describe("RadioGroupItem", () => {
    it('should render with role="radio" and default classes', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="test" data-testid="rgi" />
        </RadioGroup>
      );
      const radioItem = screen.getByTestId("rgi");
      expect(radioItem).toBeInTheDocument();
      expect(radioItem).toHaveAttribute("role", "radio");
      expect(radioItem).toHaveAttribute("aria-checked", "false");
      expect(radioItem).toHaveClass(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary"
      );
    });

    it("should merge className for RadioGroupItem", () => {
      render(
        <RadioGroup>
          <RadioGroupItem
            value="test"
            className="custom-item-class"
            data-testid="rgi"
          />
        </RadioGroup>
      );
      expect(screen.getByTestId("rgi")).toHaveClass("custom-item-class");
    });

    it("should forward ref for RadioGroupItem", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <RadioGroup>
          <RadioGroupItem value="test" ref={ref} />
        </RadioGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should display indicator (Circle icon) when checked", () => {
      render(<TestRadioGroup radioGroupProps={{ defaultValue: "option1" }} />);
      const optionOneItem = screen.getByRole("radio", { name: "Option One" });
      expect(
        optionOneItem.querySelector('[data-testid="circle-icon"]')
      ).toBeInTheDocument();
    });

    it("should not display indicator when not checked", () => {
      render(<TestRadioGroup />);
      const optionOneItem = screen.getByRole("radio", { name: "Option One" });
      expect(
        optionOneItem.querySelector('[data-testid="circle-icon"]')
      ).not.toBeInTheDocument();
    });

    it("should be disabled and have disabled styles when disabled prop is true", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="test" disabled data-testid="rgi" />
        </RadioGroup>
      );
      const radioItem = screen.getByTestId("rgi");
      expect(radioItem).toBeDisabled();
      expect(radioItem).toHaveClass(
        "disabled:cursor-not-allowed disabled:opacity-50"
      );
    });

    it("clicking an item checks it and unchecks others", async () => {
      render(<TestRadioGroup />);
      const optionOneItem = screen.getByRole("radio", { name: "Option One" });
      const optionTwoItem = screen.getByRole("radio", { name: "Option Two" });
      const optionOneLabel = screen.getByText("Option One");
      const optionTwoLabel = screen.getByText("Option Two");

      expect(optionOneItem).toHaveAttribute("aria-checked", "false");
      expect(optionTwoItem).toHaveAttribute("aria-checked", "false");

      await userEvent.click(optionOneLabel);
      expect(optionOneItem).toHaveAttribute("aria-checked", "true");
      expect(optionTwoItem).toHaveAttribute("aria-checked", "false");

      await userEvent.click(optionTwoLabel);
      expect(optionOneItem).toHaveAttribute("aria-checked", "false");
      expect(optionTwoItem).toHaveAttribute("aria-checked", "true");
    });
  });
});
