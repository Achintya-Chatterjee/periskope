import { render, screen } from "@testing-library/react";
import Spinner from "@/components/spinner";

describe("Spinner Component", () => {
  test("should renders the spinner element", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole("status", { hidden: true });
    expect(spinnerElement).toBeInTheDocument();
  });

  test("should applies correct classes for default large size", () => {
    const { container } = render(<Spinner />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const spinnerDiv = container.querySelector(".animate-spin");
    expect(spinnerDiv).toHaveClass("h-16 w-16 border-t-4 border-b-4");
  });

  test("should applies correct classes for small size", () => {
    const { container } = render(<Spinner size="small" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const spinnerDiv = container.querySelector(".animate-spin");
    expect(spinnerDiv).toHaveClass("h-8 w-8 border-t-2 border-b-2");
  });

  test("should applies correct container classes for default large size", () => {
    const { container } = render(<Spinner />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(
      "flex justify-center items-center h-screen"
    );
  });

  test("should applies correct container classes for small size", () => {
    const { container } = render(<Spinner size="small" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(
      "flex justify-center items-center py-4"
    );
  });
});
