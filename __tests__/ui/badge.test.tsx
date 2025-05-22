import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "@/components/ui/badge";

describe("Badge Component", () => {
  test("renders children correctly", () => {
    render(<Badge>Hello Badge</Badge>);
    expect(screen.getByText("Hello Badge")).toBeInTheDocument();
  });

  test("should applies default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const badgeElement = container.firstChild;

    expect(badgeElement).toHaveClass(
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary/80"
    );

    expect(badgeElement).toHaveClass(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    );
  });

  const variants = ["secondary", "destructive", "outline"] as const;

  test.each(variants)(
    "should applies correct classes for variant: %s",
    (variant) => {
      const { container } = render(
        <Badge variant={variant}>Variant {variant}</Badge>
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const badgeElement = container.firstChild;

      expect(badgeElement).toHaveClass(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      );

      if (variant === "secondary") {
        expect(badgeElement).toHaveClass(
          "bg-secondary",
          "text-secondary-foreground",
          "hover:bg-secondary/80"
        );
      } else if (variant === "destructive") {
        expect(badgeElement).toHaveClass(
          "bg-destructive",
          "text-destructive-foreground",
          "hover:bg-destructive/80"
        );
      } else if (variant === "outline") {
        expect(badgeElement).toHaveClass("text-foreground");
      }
    }
  );

  test("should passes through other props", () => {
    render(
      <Badge data-testid="my-badge" aria-label="important info">
        Badge with props
      </Badge>
    );
    const badgeElement = screen.getByTestId("my-badge");
    expect(badgeElement).toHaveAttribute("aria-label", "important info");
  });
});
