import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "@/components/ui/switch";

describe("Switch Component", () => {
  test("should render with default props (unchecked)", () => {
    render(<Switch data-testid="switch-default" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute("aria-checked", "false");
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  test("should render in a checked state using defaultChecked", () => {
    render(<Switch defaultChecked data-testid="switch-default-checked" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  test("should render in a checked state using checked prop", () => {
    render(<Switch checked data-testid="switch-checked-prop" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  test("should toggle state and call onCheckedChange on click", async () => {
    const onCheckedChange = jest.fn();
    render(
      <Switch onCheckedChange={onCheckedChange} data-testid="switch-toggle" />
    );
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toHaveAttribute("aria-checked", "false");
    await userEvent.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");

    await userEvent.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  test("should toggle state with Space key", async () => {
    const onCheckedChange = jest.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    const switchElement = screen.getByRole("switch");
    switchElement.focus();

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  test("should toggle state with Enter key", async () => {
    const onCheckedChange = jest.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    const switchElement = screen.getByRole("switch");
    switchElement.focus();

    await userEvent.keyboard("{enter}");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard("{enter}");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  test("should apply custom className", () => {
    render(<Switch className="my-custom-switch" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveClass("my-custom-switch");
  });

  test("should be disabled and not interactive", async () => {
    const onCheckedChange = jest.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} />);
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass("disabled:opacity-50");
    expect(switchElement).toHaveClass("disabled:cursor-not-allowed");

    await userEvent.click(switchElement).catch(() => {});
    expect(onCheckedChange).not.toHaveBeenCalled();

    switchElement.focus();
    await userEvent.keyboard(" ").catch(() => {});
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  test("should forward ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test("controlled component behavior with checked and onCheckedChange", async () => {
    let isChecked = false;
    const handleCheckedChange = jest.fn((checkedStatus: boolean) => {
      isChecked = checkedStatus;
    });
    const { rerender } = render(
      <Switch checked={isChecked} onCheckedChange={handleCheckedChange} />
    );
    const switchElement = screen.getByRole("switch");

    expect(switchElement).toHaveAttribute("aria-checked", "false");

    isChecked = true;
    rerender(
      <Switch checked={isChecked} onCheckedChange={handleCheckedChange} />
    );
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    await userEvent.click(switchElement);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
    isChecked = false;
    rerender(
      <Switch checked={isChecked} onCheckedChange={handleCheckedChange} />
    );
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });
});
