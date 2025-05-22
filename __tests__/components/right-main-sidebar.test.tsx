import { render, screen } from "@testing-library/react";
import RightMainSidebar from "@/components/right-main-sidebar";

describe("RightMainSidebar Component", () => {
  test("should render the sidebar", () => {
    render(<RightMainSidebar />);
    const expandButton = screen.getByLabelText("Expand sidebar");
    expect(expandButton).toBeInTheDocument();
  });

  test("should render all icon buttons with correct aria-labels", () => {
    render(<RightMainSidebar />);
    const expectedButtons = [
      { label: "Expand sidebar" },
      { label: "Refresh" },
      { label: "Edit" },
      { label: "Paragraph" },
      { label: "Checklist" },
      { label: "Hubspot" },
      { label: "Groups" },
      { label: "Mentions" },
      { label: "Gallery" },
      { label: "List settings" },
    ];

    expectedButtons.forEach((button) => {
      expect(screen.getByLabelText(button.label)).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole("button");
    expect(allButtons.length).toBe(expectedButtons.length);
  });
});
