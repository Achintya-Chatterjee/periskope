import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("Card Component and parts", () => {
  test("should render Card with children", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  test("should apply default Card classes", () => {
    const { container } = render(<Card>Test</Card>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "text-card-foreground",
      "shadow-sm"
    );
  });

  test("should render CardHeader with children", () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  test("should apply default CardHeader classes", () => {
    const { container } = render(<CardHeader>Test</CardHeader>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass(
      "flex",
      "flex-col",
      "space-y-1.5",
      "p-6"
    );
  });

  test("should render CardTitle with children", () => {
    render(<CardTitle>Title Content</CardTitle>);
    expect(screen.getByText("Title Content")).toBeInTheDocument();
  });

  test("should apply default CardTitle classes", () => {
    const { container } = render(<CardTitle>Test</CardTitle>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass(
      "text-2xl",
      "font-semibold",
      "leading-none",
      "tracking-tight"
    );
  });

  test("should render CardDescription with children", () => {
    render(<CardDescription>Description Content</CardDescription>);
    expect(screen.getByText("Description Content")).toBeInTheDocument();
  });

  test("should apply default CardDescription classes", () => {
    const { container } = render(<CardDescription>Test</CardDescription>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass(
      "text-sm",
      "text-muted-foreground"
    );
  });

  test("should render CardContent with children", () => {
    render(<CardContent>Main Content</CardContent>);
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  test("should apply default CardContent classes", () => {
    const { container } = render(<CardContent>Test</CardContent>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass("p-6", "pt-0");
  });

  test("should render CardFooter with children", () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  test("should apply default CardFooter classes", () => {
    const { container } = render(<CardFooter>Test</CardFooter>);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass(
      "flex",
      "items-center",
      "p-6",
      "pt-0"
    );
  });

  test("should render a complete Card structure", () => {
    render(
      <Card className="my-card">
        <CardHeader className="my-header">
          <CardTitle className="my-title">Test Title</CardTitle>
          <CardDescription className="my-desc">
            Test Description
          </CardDescription>
        </CardHeader>
        <CardContent className="my-content">Test Content</CardContent>
        <CardFooter className="my-footer">Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();

    const card = screen.getByText("Test Title").closest(".my-card");
    expect(card).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access
    expect(card?.querySelector(".my-header")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(card?.querySelector(".my-title")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(card?.querySelector(".my-desc")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(card?.querySelector(".my-content")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(card?.querySelector(".my-footer")).toBeInTheDocument();
  });

  test("should pass through other HTML attributes", () => {
    render(
      <Card data-testid="custom-card" aria-label="test-card">
        <CardHeader data-testid="custom-header">
          <CardTitle data-testid="custom-title">Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByTestId("custom-card")).toBeInTheDocument();
    expect(screen.getByLabelText("test-card")).toBeInTheDocument();
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });
});
