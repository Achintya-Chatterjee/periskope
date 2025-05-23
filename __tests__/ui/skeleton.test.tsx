import React from "react";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton Component", () => {
  test("should render successfully", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  test("should have default classes applied", () => {
    render(<Skeleton data-testid="skeleton-default" />);
    const skeletonElement = screen.getByTestId("skeleton-default");
    expect(skeletonElement).toHaveClass("animate-pulse");
    expect(skeletonElement).toHaveClass("rounded-md");
    expect(skeletonElement).toHaveClass("bg-muted");
  });

  test("should apply custom className and merge with default classes", () => {
    render(
      <Skeleton
        data-testid="skeleton-custom"
        className="my-custom-class w-full h-4"
      />
    );
    const skeletonElement = screen.getByTestId("skeleton-custom");
    expect(skeletonElement).toHaveClass("animate-pulse");
    expect(skeletonElement).toHaveClass("rounded-md");
    expect(skeletonElement).toHaveClass("bg-muted");
    expect(skeletonElement).toHaveClass("my-custom-class");
    expect(skeletonElement).toHaveClass("w-full");
    expect(skeletonElement).toHaveClass("h-4");
  });

  test("should pass through other HTML attributes", () => {
    render(
      <Skeleton
        data-testid="skeleton-attrs"
        aria-label="Loading content"
        id="test-id"
      />
    );
    const skeletonElement = screen.getByTestId("skeleton-attrs");
    expect(skeletonElement).toHaveAttribute("aria-label", "Loading content");
    expect(skeletonElement).toHaveAttribute("id", "test-id");
  });

  test("should forward ref to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
