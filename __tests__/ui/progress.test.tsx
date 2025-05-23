import React from "react";
import { render, screen } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

describe("Progress Component", () => {
  it("should render the progress bar with default structure and classes", () => {
    const { container } = render(<Progress value={50} />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toBeInTheDocument();
    expect(progressRoot).toHaveClass(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary"
    );

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indicator = container.querySelector(
      ".h-full.w-full.flex-1.bg-primary.transition-all"
    );
    expect(indicator).toBeInTheDocument();
  });

  it("should merge className prop", () => {
    render(<Progress value={50} className="custom-progress-class" />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toHaveClass("custom-progress-class");
  });

  it("should set correct ARIA attributes based on value", () => {
    render(<Progress value={60} />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toHaveAttribute("aria-valuenow", "60");
    expect(progressRoot).toHaveAttribute("aria-valuemin", "0");
    expect(progressRoot).toHaveAttribute("aria-valuemax", "100");
  });

  it("should handle null or 0 value for ARIA and style", () => {
    const { rerender, container } = render(<Progress value={null} />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toHaveAttribute("aria-valuenow", "0");

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    let indicator = container.querySelector(
      '[style*="transform: translateX(-100%)"]'
    ) as HTMLElement;
    expect(indicator).toBeInTheDocument();

    rerender(<Progress value={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    indicator = container.querySelector(
      '[style*="transform: translateX(-100%)"]'
    ) as HTMLElement;
    expect(indicator).toBeInTheDocument();
  });

  it("should set correct style for 100% value", () => {
    const { container } = render(<Progress value={100} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indicator = container.querySelector(
      '[style*="transform: translateX(-0%)"]'
    ) as HTMLElement;
    expect(indicator).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
  });

  it("should set correct style for an intermediate value", () => {
    const { container } = render(<Progress value={75} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indicator = container.querySelector(
      '[style*="transform: translateX(-25%)"]'
    ) as HTMLElement;
    expect(indicator).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "75"
    );
  });

  it("should forward ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress value={50} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "progressbar");
  });

  it("should default to 0 if value is not provided (matches aria-valuenow behavior)", () => {
    const { container } = render(<Progress />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toHaveAttribute("aria-valuenow", "0");
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indicator = container.querySelector(
      '[style*="transform: translateX(-100%)"]'
    ) as HTMLElement;
    expect(indicator).toBeInTheDocument();
  });
});
