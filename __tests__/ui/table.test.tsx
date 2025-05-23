import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
  cn: jest.fn((...inputs) =>
    inputs
      .flat(Infinity)
      .filter((input) => typeof input === 'string' || (typeof input === 'object' && input !== null))
      .map((input) => {
        if (typeof input === "object" && input !== null && !Array.isArray(input)) {
          return Object.entries(input)
            .filter(([_key, value]) => Boolean(value))
            .map(([key, _value]) => key)
            .join(" ");
        }
        return String(input);
      })
      .filter(
        (input) =>
          input &&
          input !== "null" &&
          input !== "undefined" &&
          input.trim() !== ""
      )
      .join(" ")
  ),
}));


describe("Table Components", () => {
  describe("Table", () => {
    it("should render a table element within a div wrapper", () => {
      render(<Table data-testid="table" />);
      const table = screen.getByTestId("table");
      expect(table.tagName).toBe("TABLE");
      // eslint-disable-next-line testing-library/no-node-access
      expect(table.parentElement?.tagName).toBe("DIV");
      // eslint-disable-next-line testing-library/no-node-access
      expect(table.parentElement).toHaveClass("relative w-full overflow-auto");
    });

    it("should apply custom className to the table", () => {
      render(<Table data-testid="table" className="my-custom-table" />);
      expect(screen.getByTestId("table")).toHaveClass("my-custom-table");
    });

    it("should forward ref to the table element", () => {
      const ref = React.createRef<HTMLTableElement>();
      render(<Table ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });
  });

  describe("TableHeader", () => {
    it("should render a thead element", () => {
      render(
        <Table>
          <TableHeader data-testid="thead" />
        </Table>
      );
      expect(screen.getByTestId("thead").tagName).toBe("THEAD");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableHeader data-testid="thead" className="my-custom-header" />
        </Table>
      );
      expect(screen.getByTestId("thead")).toHaveClass("my-custom-header");
    });

    it("should forward ref to the thead element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableHeader ref={ref} />
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(ref.current?.tagName).toBe("THEAD");
    });
  });

  describe("TableBody", () => {
    it("should render a tbody element", () => {
      render(
        <Table>
          <TableBody data-testid="tbody" />
        </Table>
      );
      expect(screen.getByTestId("tbody").tagName).toBe("TBODY");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableBody data-testid="tbody" className="my-custom-body" />
        </Table>
      );
      expect(screen.getByTestId("tbody")).toHaveClass("my-custom-body");
    });

    it("should forward ref to the tbody element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableBody ref={ref} />
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(ref.current?.tagName).toBe("TBODY");
    });
  });

  describe("TableFooter", () => {
    it("should render a tfoot element", () => {
      render(
        <Table>
          <TableFooter data-testid="tfoot" />
        </Table>
      );
      expect(screen.getByTestId("tfoot").tagName).toBe("TFOOT");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableFooter data-testid="tfoot" className="my-custom-footer" />
        </Table>
      );
      expect(screen.getByTestId("tfoot")).toHaveClass("my-custom-footer");
    });

    it("should forward ref to the tfoot element", () => {
      const ref = React.createRef<HTMLTableSectionElement>();
      render(
        <Table>
          <TableFooter ref={ref} />
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(ref.current?.tagName).toBe("TFOOT");
    });
  });

  describe("TableRow", () => {
    it("should render a tr element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="tr" />
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId("tr").tagName).toBe("TR");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="tr" className="my-custom-row" />
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId("tr")).toHaveClass("my-custom-row");
    });

    it("should forward ref to the tr element", () => {
      const ref = React.createRef<HTMLTableRowElement>();
      render(
        <Table>
          <TableBody>
            <TableRow ref={ref} />
          </TableBody>
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    });
  });

  describe("TableHead", () => {
    it("should render a th element", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="th">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      const thElement = screen.getByTestId("th");
      expect(thElement.tagName).toBe("TH");
      expect(thElement).toHaveTextContent("Header");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="th" className="my-custom-th">
                Header
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId("th")).toHaveClass("my-custom-th");
    });

    it("should forward ref to the th element", () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead ref={ref} />
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
      expect(ref.current?.tagName).toBe("TH");
    });
  });

  describe("TableCell", () => {
    it("should render a td element", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell data-testid="td">Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const tdElement = screen.getByTestId("td");
      expect(tdElement.tagName).toBe("TD");
      expect(tdElement).toHaveTextContent("Data");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell data-testid="td" className="my-custom-td">
                Data
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId("td")).toHaveClass("my-custom-td");
    });

    it("should forward ref to the td element", () => {
      const ref = React.createRef<HTMLTableCellElement>();
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell ref={ref} />
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
      expect(ref.current?.tagName).toBe("TD");
    });
  });

  describe("TableCaption", () => {
    it("should render a caption element", () => {
      render(
        <Table>
          <TableCaption data-testid="caption">My Table Caption</TableCaption>
        </Table>
      );
      const captionElement = screen.getByTestId("caption");
      expect(captionElement.tagName).toBe("CAPTION");
      expect(captionElement).toHaveTextContent("My Table Caption");
    });

    it("should apply custom className", () => {
      render(
        <Table>
          <TableCaption data-testid="caption" className="my-custom-caption">
            My Table Caption
          </TableCaption>
        </Table>
      );
      expect(screen.getByTestId("caption")).toHaveClass("my-custom-caption");
    });

    it("should forward ref to the caption element", () => {
      const ref = React.createRef<HTMLTableCaptionElement>();
      render(
        <Table>
          <TableCaption ref={ref} />
        </Table>
      );
      expect(ref.current).toBeInstanceOf(HTMLTableCaptionElement);
    });
  });

  it("should render a full table structure", () => {
    render(
      <Table>
        <TableCaption>List of Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Doe</TableCell>
            <TableCell>jane@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: 2 Users</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText("List of Users")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Total: 2 Users")).toBeInTheDocument();
  });
}); 