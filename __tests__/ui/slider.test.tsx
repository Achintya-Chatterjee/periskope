import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "@/components/ui/slider";

if (typeof window !== "undefined" && typeof window.DOMRect === "undefined") {
  // @ts-ignore
  window.DOMRect = class DOMRect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    static fromRect(other?: DOMRectInit): DOMRect {
      return new DOMRect(other?.x, other?.y, other?.width, other?.height);
    }
    toJSON() {
      return JSON.stringify(this);
    }
  };
}

describe("Slider Component", () => {
  test("should render with default props", () => {
    render(<Slider defaultValue={[50]} max={100} min={0} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  test("should apply custom className", () => {
    render(
      <Slider
        defaultValue={[50]}
        className="my-custom-slider"
        data-testid="slider-root"
      />
    );
    const sliderRoot = screen.getByTestId("slider-root");
    expect(sliderRoot).toHaveClass("my-custom-slider");
  });

  test("should be disabled and not interactive", () => {
    const onValueChange = jest.fn();
    render(
      <Slider
        defaultValue={[50]}
        disabled
        onValueChange={onValueChange}
        data-testid="disabled-slider-root"
      />
    );
    const sliderRoot = screen.getByTestId("disabled-slider-root");
    const sliderThumb = screen.getByRole("slider");

    expect(sliderRoot).toHaveAttribute("data-disabled");
    expect(sliderThumb).toHaveClass("disabled:opacity-50");

    fireEvent.keyDown(sliderThumb, { key: "ArrowRight" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test("should change value with keyboard interactions (ArrowRight, ArrowLeft, Home, End)", () => {
    const onValueChange = jest.fn();
    render(
      <Slider
        defaultValue={[50]}
        max={100}
        min={0}
        step={1}
        onValueChange={onValueChange}
      />
    );
    const slider = screen.getByRole("slider");

    slider.focus();

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith([51]);
    expect(slider).toHaveAttribute("aria-valuenow", "51");

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith([50]);
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(slider, { key: "PageUp" });
    expect(onValueChange).toHaveBeenCalledWith([60]);
    expect(slider).toHaveAttribute("aria-valuenow", "60");

    fireEvent.keyDown(slider, { key: "PageDown" });
    expect(onValueChange).toHaveBeenCalledWith([50]);
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(slider, { key: "Home" });
    expect(onValueChange).toHaveBeenCalledWith([0]);
    expect(slider).toHaveAttribute("aria-valuenow", "0");

    fireEvent.keyDown(slider, { key: "End" });
    expect(onValueChange).toHaveBeenCalledWith([100]);
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });

  test("should call onValueChange with the new value", () => {
    const onValueChange = jest.fn();
    render(
      <Slider
        defaultValue={[25]}
        max={100}
        min={0}
        step={5}
        onValueChange={onValueChange}
      />
    );
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith([30]);
  });

  test("should render and interact with multiple thumbs", () => {
    const onValueChange = jest.fn();
    render(
      <Slider
        defaultValue={[20, 80]}
        max={100}
        min={0}
        step={1}
        onValueChange={onValueChange}
      />
    );
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);

    const firstThumb = sliders[0];
    const secondThumb = sliders[1];

    expect(firstThumb).toHaveAttribute("aria-valuenow", "20");
    expect(secondThumb).toHaveAttribute("aria-valuenow", "80");

    firstThumb.focus();
    fireEvent.keyDown(firstThumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith([21, 80]);
    expect(firstThumb).toHaveAttribute("aria-valuenow", "21");

    secondThumb.focus();
    fireEvent.keyDown(secondThumb, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith([21, 79]);
    expect(secondThumb).toHaveAttribute("aria-valuenow", "79");
  });

  test("should forward ref to the SliderPrimitive.Root element", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Slider defaultValue={[50]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  test("should handle orientation prop (visual aspects not testable in JSDOM)", () => {
    render(<Slider defaultValue={[50]} orientation="vertical" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-orientation", "vertical");
  });

  test("should handle inverted prop (interaction behavior changes)", () => {
    const onValueChange = jest.fn();
    render(
      <Slider
        defaultValue={[50]}
        max={100}
        min={0}
        step={1}
        onValueChange={onValueChange}
        inverted
      />
    );
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith([49]);
  });
});
