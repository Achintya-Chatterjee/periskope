import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

describe("Alert Component", () => {
  test("should renders Alert with Title and Description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
    expect(
      screen.getByText("You can add components to your app using the cli.")
    ).toBeInTheDocument();
  });

  test("should renders Alert with an icon", () => {
    const { container } = render(
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    );

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
  });

  test("should applies default variant classes", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Test</AlertTitle>
      </Alert>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const alertElement = container.firstChild;

    expect(alertElement).toHaveClass("bg-background text-foreground");
  });

  test("should applies destructive variant classes", () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This is a destructive alert.</AlertDescription>
      </Alert>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const alertElement = container.firstChild;

    expect(alertElement).toHaveClass(
      "border-destructive/50 text-destructive dark:border-destructive"
    );
  });

  test("should AlertTitle and AlertDescription render correctly", () => {
    render(
      <Alert>
        <AlertTitle data-testid="alert-title">Title Here</AlertTitle>
        <AlertDescription data-testid="alert-desc">
          Description Here
        </AlertDescription>
      </Alert>
    );
    const title = screen.getByTestId("alert-title");
    const description = screen.getByTestId("alert-desc");
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(title).toHaveClass("mb-1 font-medium leading-none tracking-tight");
    expect(description).toHaveClass("text-sm [&_p]:leading-relaxed");
  });
});
