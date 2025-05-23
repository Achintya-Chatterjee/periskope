import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  ChevronLeft: (props: any) => (
    <svg data-testid="chevron-left-icon" {...props} />
  ),
  ChevronRight: (props: any) => (
    <svg data-testid="chevron-right-icon" {...props} />
  ),
  MoreHorizontal: (props: any) => (
    <svg data-testid="more-horizontal-icon" {...props} />
  ),
}));

describe("Pagination Component Suite", () => {
  describe("Pagination", () => {
    it("should render a nav element with correct ARIA attributes and default classes", () => {
      render(<Pagination data-testid="pagination-nav" />);
      const navElement = screen.getByTestId("pagination-nav");
      expect(navElement).toBeInTheDocument();
      expect(navElement.tagName).toBe("NAV");
      expect(navElement).toHaveAttribute("role", "navigation");
      expect(navElement).toHaveAttribute("aria-label", "pagination");
      expect(navElement).toHaveClass("mx-auto flex w-full justify-center");
    });

    it("should merge className for Pagination", () => {
      render(
        <Pagination className="custom-class" data-testid="pagination-nav" />
      );
      expect(screen.getByTestId("pagination-nav")).toHaveClass("custom-class");
    });
  });

  describe("PaginationContent", () => {
    it("should render a ul element with default classes", () => {
      render(<PaginationContent data-testid="pagination-ul" />);
      const ulElement = screen.getByTestId("pagination-ul");
      expect(ulElement).toBeInTheDocument();
      expect(ulElement.tagName).toBe("UL");
      expect(ulElement).toHaveClass("flex flex-row items-center gap-1");
    });

    it("should merge className for PaginationContent", () => {
      render(
        <PaginationContent
          className="custom-ul-class"
          data-testid="pagination-ul"
        />
      );
      expect(screen.getByTestId("pagination-ul")).toHaveClass(
        "custom-ul-class"
      );
    });

    it("should forward ref for PaginationContent", () => {
      const ref = React.createRef<HTMLUListElement>();
      render(<PaginationContent ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe("PaginationItem", () => {
    it("should render an li element", () => {
      render(<PaginationItem data-testid="pagination-li" />);
      const liElement = screen.getByTestId("pagination-li");
      expect(liElement).toBeInTheDocument();
      expect(liElement.tagName).toBe("LI");
    });

    it("should merge className for PaginationItem", () => {
      render(
        <PaginationItem
          className="custom-li-class"
          data-testid="pagination-li"
        />
      );
      expect(screen.getByTestId("pagination-li")).toHaveClass(
        "custom-li-class"
      );
    });

    it("should forward ref for PaginationItem", () => {
      const ref = React.createRef<HTMLLIElement>();
      render(<PaginationItem ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe("PaginationLink", () => {
    it("should render an anchor element with default ghost variant", () => {
      render(<PaginationLink href="#">1</PaginationLink>);
      const linkElement = screen.getByText("1");
      expect(linkElement.tagName).toBe("A");
      expect(linkElement).toHaveAttribute("href", "#");
      const expectedGhostClasses = cn(
        buttonVariants({ variant: "ghost", size: "icon" })
      ).split(" ");
      expectedGhostClasses.forEach((cls) =>
        expect(linkElement).toHaveClass(cls)
      );
    });

    it("should apply active styles and aria-current when isActive is true", () => {
      render(
        <PaginationLink href="#" isActive>
          2
        </PaginationLink>
      );
      const linkElement = screen.getByText("2");
      expect(linkElement).toHaveAttribute("aria-current", "page");
      const expectedOutlineClasses = cn(
        buttonVariants({ variant: "outline", size: "icon" })
      ).split(" ");
      expectedOutlineClasses.forEach((cls) =>
        expect(linkElement).toHaveClass(cls)
      );
    });

    it("should apply correct size class", () => {
      render(
        <PaginationLink href="#" size="default">
          3
        </PaginationLink>
      );
      const linkElement = screen.getByText("3");
      const expectedDefaultSizeClasses = cn(
        buttonVariants({ variant: "ghost", size: "default" })
      ).split(" ");
      expectedDefaultSizeClasses.forEach((cls) =>
        expect(linkElement).toHaveClass(cls)
      );
    });

    it("should merge className for PaginationLink", () => {
      render(
        <PaginationLink href="#" className="custom-link-class">
          4
        </PaginationLink>
      );
      expect(screen.getByText("4")).toHaveClass("custom-link-class");
    });
  });

  describe("PaginationPrevious", () => {
    it('should render a link with "Previous" text, icon, and ARIA label', () => {
      render(<PaginationPrevious href="#" />);
      const linkElement = screen.getByLabelText("Go to previous page");
      expect(linkElement).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByTestId("chevron-left-icon")).toBeInTheDocument();
      expect(linkElement).toHaveClass("gap-1 pl-2.5");
      const expectedClasses = cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pl-2.5"
      ).split(" ");
      expectedClasses.forEach((cls) => expect(linkElement).toHaveClass(cls));
    });

    it("should merge className for PaginationPrevious", () => {
      render(<PaginationPrevious href="#" className="custom-prev-class" />);
      expect(screen.getByLabelText("Go to previous page")).toHaveClass(
        "custom-prev-class"
      );
    });
  });

  describe("PaginationNext", () => {
    it('should render a link with "Next" text, icon, and ARIA label', () => {
      render(<PaginationNext href="#" />);
      const linkElement = screen.getByLabelText("Go to next page");
      expect(linkElement).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
      expect(linkElement).toHaveClass("gap-1 pr-2.5");
      const expectedClasses = cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "gap-1 pr-2.5"
      ).split(" ");
      expectedClasses.forEach((cls) => expect(linkElement).toHaveClass(cls));
    });
    it("should merge className for PaginationNext", () => {
      render(<PaginationNext href="#" className="custom-next-class" />);
      expect(screen.getByLabelText("Go to next page")).toHaveClass(
        "custom-next-class"
      );
    });
  });

  describe("PaginationEllipsis", () => {
    it("should render a span with icon, sr-only text, and ARIA hidden", () => {
      render(<PaginationEllipsis />);
      const spanElement = screen
        .getByTestId("more-horizontal-icon")
        .closest("span");
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByText("More pages")).toHaveClass("sr-only");
      expect(screen.getByTestId("more-horizontal-icon")).toBeInTheDocument();
      expect(spanElement).toHaveClass(
        "flex h-9 w-9 items-center justify-center"
      );
    });
    it("should merge className for PaginationEllipsis", () => {
      render(<PaginationEllipsis className="custom-ellipsis-class" />);
      const spanElement = screen
        .getByTestId("more-horizontal-icon")
        .closest("span");
      expect(spanElement).toHaveClass("custom-ellipsis-class");
    });
  });

  describe("Integration", () => {
    it("should render a complete pagination structure", () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      expect(
        screen.getByRole("navigation", { name: "pagination" })
      ).toBeInTheDocument();
      expect(screen.getByText("Previous").closest("ul")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
      expect(screen.getByTestId("more-horizontal-icon")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });
});
