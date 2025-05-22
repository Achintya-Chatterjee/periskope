import { render, screen } from "@testing-library/react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

describe("AspectRatio Component", () => {
  test("should renders children correctly", () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img src="test.jpg" alt="Test Image" data-testid="test-image" />
      </AspectRatio>
    );
    const imageElement = screen.getByTestId("test-image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("alt", "Test Image");
  });

  test("should applies aspect ratio styles (indirectly via Radix)", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <div data-testid="child-div">Hello</div>
      </AspectRatio>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const radixWrapper = container.firstChild?.firstChild as HTMLElement | null;
    expect(radixWrapper).toBeInTheDocument();

    expect(radixWrapper).toHaveAttribute("style");

    expect(screen.getByTestId("child-div")).toBeInTheDocument();
  });

  test("should renders with default ratio if none provided (1/1)", () => {
    const { container } = render(
      <AspectRatio>
        <div data-testid="child-div">Hello</div>
      </AspectRatio>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const radixWrapper = container.firstChild?.firstChild as HTMLElement | null;
    expect(radixWrapper).toHaveAttribute("style");
    expect(screen.getByTestId("child-div")).toBeInTheDocument();
  });
});
