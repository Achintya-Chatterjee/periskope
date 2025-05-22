import { render, screen } from "@testing-library/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

describe("Breadcrumb Component", () => {
  test("should renders a basic breadcrumb structure", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Components").closest("a")).toHaveAttribute(
      "href",
      "/components"
    );
    expect(screen.getByText("Breadcrumb").tagName).toBe("SPAN");

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const separators = screen.getAllByRole("presentation", { hidden: true });
    expect(separators.length).toBeGreaterThanOrEqual(2);

    separators.forEach((separator) => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(separator.querySelector("svg")).toBeInTheDocument();
    });
  });

  test("should renders breadcrumb with ellipsis", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const ellipsisSpan = document.querySelector(
      'li > span[role="presentation"]'
    );
    expect(ellipsisSpan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(ellipsisSpan?.querySelector("svg")).toBeInTheDocument();

    expect(
      screen.getByText("More", { selector: ".sr-only" })
    ).toBeInTheDocument();
  });

  test("should BreadcrumbLink renders as a link or span (asChild)", () => {
    render(
      <BreadcrumbItem>
        <BreadcrumbLink href="/test-link">Actual Link</BreadcrumbLink>
        <BreadcrumbLink asChild>
          <span>Span Link</span>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
    expect(screen.getByText("Actual Link").tagName).toBe("A");
    expect(screen.getByText("Span Link").tagName).toBe("SPAN");
  });
});
