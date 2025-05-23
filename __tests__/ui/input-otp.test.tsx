import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

describe("InputOTP Component", () => {
  it("should render the correct number of slots", () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup data-testid="otp-group">
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              data-testid={`slot-${index}`}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
    const group = screen.getByTestId("otp-group");
    // eslint-disable-next-line testing-library/no-node-access
    expect(group.children.length).toBe(6);
    expect(screen.getAllByRole("textbox", { hidden: true })).toHaveLength(1);
  });

  it("should render InputOTPGroup and InputOTPSlot", () => {
    render(
      <InputOTP maxLength={3}>
        <InputOTPGroup data-testid="otp-group">
          <InputOTPSlot index={0} data-testid="otp-slot-0" />
          <InputOTPSlot index={1} data-testid="otp-slot-1" />
          <InputOTPSlot index={2} data-testid="otp-slot-2" />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByTestId("otp-group")).toBeInTheDocument();
    expect(screen.getByTestId("otp-slot-0")).toBeInTheDocument();
    expect(screen.getByTestId("otp-slot-1")).toBeInTheDocument();
    expect(screen.getByTestId("otp-slot-2")).toBeInTheDocument();
  });

  it("should render InputOTPSeparator", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSeparator data-testid="otp-separator" />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByTestId("otp-separator")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("should allow typing into the hidden input and call onChange", async () => {
    const handleChange = jest.fn();
    render(
      <InputOTP maxLength={3} onChange={handleChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="slot-0" />
          <InputOTPSlot index={1} data-testid="slot-1" />
          <InputOTPSlot index={2} data-testid="slot-2" />
        </InputOTPGroup>
      </InputOTP>
    );

    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    await userEvent.type(hiddenInput, "123");

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith("123");
    expect(screen.getByTestId("slot-0")).toHaveTextContent("1");
    expect(screen.getByTestId("slot-1")).toHaveTextContent("2");
    expect(screen.getByTestId("slot-2")).toHaveTextContent("3");
  });

  it("should fill slots with initial value", () => {
    render(
      <InputOTP maxLength={3} value="456">
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="slot-0" />
          <InputOTPSlot index={1} data-testid="slot-1" />
          <InputOTPSlot index={2} data-testid="slot-2" />
        </InputOTPGroup>
      </InputOTP>
    );

    expect(screen.getByTestId("slot-0")).toHaveTextContent("4");
    expect(screen.getByTestId("slot-1")).toHaveTextContent("5");
    expect(screen.getByTestId("slot-2")).toHaveTextContent("6");
  });

  it("should respect maxLength prop", async () => {
    const handleChange = jest.fn();
    render(
      <InputOTP maxLength={2} onChange={handleChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );

    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    await userEvent.type(hiddenInput, "123");

    expect(handleChange).toHaveBeenLastCalledWith("12");
  });

  it("InputOTPSlot should show active state and fake caret when a character is typed", async () => {
    render(
      <InputOTP maxLength={3}>
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="slot-0" />
          <InputOTPSlot index={1} data-testid="slot-1" />
          <InputOTPSlot index={2} data-testid="slot-2" />
        </InputOTPGroup>
      </InputOTP>
    );

    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    const firstSlotContainer = screen.getByTestId("slot-0");
    const secondSlotContainer = screen.getByTestId("slot-1");

    fireEvent.focus(hiddenInput);
    await waitFor(() => {
      expect(firstSlotContainer).toHaveClass(
        "z-10 ring-2 ring-ring ring-offset-background"
      );
    });

    await userEvent.type(hiddenInput, "1");

    await waitFor(() => {
      expect(secondSlotContainer).toHaveClass(
        "z-10 ring-2 ring-ring ring-offset-background"
      );
      const caretDiv = secondSlotContainer.querySelector(
        ".animate-caret-blink"
      );
      expect(caretDiv).toBeInTheDocument();
    });
  });

  it("should disable input when disabled prop is true on InputOTP", async () => {
    render(
      <InputOTP
        maxLength={3}
        disabled
        containerClassName="test-disabled-container"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
      </InputOTP>
    );

    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    expect(hiddenInput).toBeDisabled();

    // eslint-disable-next-line testing-library/no-node-access
    const otpMainContainer = hiddenInput.parentElement?.parentElement;
    expect(otpMainContainer).toHaveClass("has-[:disabled]:opacity-50");
  });

  it("should apply custom className to InputOTP (hidden input)", () => {
    render(
      <InputOTP maxLength={1} className="custom-input-otp">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    expect(hiddenInput).toHaveClass("custom-input-otp");
  });

  it("should apply custom containerClassName to InputOTP's main div", () => {
    render(
      <InputOTP maxLength={1} containerClassName="custom-container">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    // eslint-disable-next-line testing-library/no-node-access
    expect(hiddenInput.parentElement?.parentElement).toHaveClass(
      "custom-container"
    );
  });

  it("should apply custom className to InputOTPGroup", () => {
    render(
      <InputOTP maxLength={1}>
        <InputOTPGroup className="custom-group" data-testid="otp-group">
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByTestId("otp-group")).toHaveClass("custom-group");
  });

  it("should apply custom className to InputOTPSlot", () => {
    render(
      <InputOTP maxLength={1}>
        <InputOTPGroup>
          <InputOTPSlot index={0} className="custom-slot" data-testid="slot" />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByTestId("slot")).toHaveClass("custom-slot");
  });

  it("should apply custom className to InputOTPSeparator", () => {
    render(
      <InputOTP maxLength={2}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSeparator
            className="custom-separator"
            data-testid="separator"
          />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
  });

  it("should visually focus next slot on input via hidden input", async () => {
    render(
      <InputOTP maxLength={3}>
        <InputOTPGroup>
          <InputOTPSlot index={0} data-testid="slot-0" />
          <InputOTPSlot index={1} data-testid="slot-1" />
          <InputOTPSlot index={2} data-testid="slot-2" />
        </InputOTPGroup>
      </InputOTP>
    );
    const hiddenInput = screen.getByRole("textbox", { hidden: true });
    const slot0 = screen.getByTestId("slot-0");
    const slot1 = screen.getByTestId("slot-1");
    const slot2 = screen.getByTestId("slot-2");

    fireEvent.focus(hiddenInput);
    await waitFor(() => expect(slot0).toHaveClass("z-10"));

    await userEvent.type(hiddenInput, "1");
    await waitFor(() => expect(slot1).toHaveClass("z-10"));
    expect(slot0).not.toHaveClass("z-10");

    await userEvent.type(hiddenInput, "2");
    await waitFor(() => expect(slot2).toHaveClass("z-10"));
    expect(slot1).not.toHaveClass("z-10");
  });

  it("InputOTP should forward ref to the hidden input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <InputOTP maxLength={1} ref={ref}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("data-input-otp", "true");
  });

  it("InputOTPGroup should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <InputOTP maxLength={1}>
        <InputOTPGroup ref={ref}>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("InputOTPSlot should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <InputOTP maxLength={1}>
        <InputOTPGroup>
          <InputOTPSlot index={0} ref={ref} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("InputOTPSeparator should forward ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <InputOTP maxLength={2}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSeparator ref={ref} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
