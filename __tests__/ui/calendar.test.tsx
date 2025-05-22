import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

describe("Calendar Component", () => {
  test("should render the calendar", () => {
    render(<Calendar />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  test("should navigate to the next and previous months", () => {
    render(<Calendar initialFocus />); 
    const today = new Date();
    const currentMonthText = today.toLocaleString("default", { month: "long" });

    expect(screen.getByText(new RegExp(currentMonthText, "i"))).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous month/i });
    const nextButton = screen.getByRole("button", { name: /next month/i });

    fireEvent.click(nextButton);
    expect(screen.queryByText(new RegExp(currentMonthText, "i"))).not.toBeInTheDocument();

    fireEvent.click(prevButton);
    fireEvent.click(prevButton); 
    expect(screen.queryByText(new RegExp(currentMonthText, "i"))).not.toBeInTheDocument();
    
    fireEvent.click(nextButton); 
    expect(screen.getByText(new RegExp(currentMonthText, "i"))).toBeInTheDocument();
  });

  test("should select a day when clicked", async () => {
    const testDate = new Date(2024, 6, 15);

    const TestWrapper = () => {
      const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
      return (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          defaultMonth={testDate}
        />
      );
    };
    render(<TestWrapper />);

    const dayMatcher = (content: string, element: Element | null): boolean => {
      if (!element) return false;
      const button = element.closest('button');
      if (!button) return false;
      return (
        button.getAttribute("name") === "day" &&
        button.textContent?.trim() === "15"
      );
    };
    
    const dayButton = screen.getByRole('gridcell', { name: (accessibleName, element) => element.textContent?.trim() === '15' });

    expect(dayButton).toBeInTheDocument();

    expect(dayButton).not.toHaveClass("bg-primary");
    expect(dayButton.getAttribute("aria-selected")).not.toBe("true");

    fireEvent.click(dayButton);

    await waitFor(() => {
      const selectedDayButton = screen.getByRole('gridcell', { name: (accessibleName, element) => element.textContent?.trim() === '15' });
      expect(selectedDayButton).toHaveClass("bg-primary");
      expect(selectedDayButton.getAttribute("aria-selected")).toBe("true");
    });
  });

  test("should display outside days by default", () => {
    const { container } = render(<Calendar defaultMonth={new Date(2024, 6, 1)} />); 
    // eslint-disable-next-line testing-library/no-container
    const outsideDayElements = container.querySelectorAll('.day-outside');
    expect(outsideDayElements.length).toBeGreaterThan(0);
  });

  test("should apply custom classNames", () => {
    const { container } = render(<Calendar className="my-custom-calendar" classNames={{ month: "my-custom-month" }} />);
    // eslint-disable-next-line testing-library/no-container
    expect(container.firstChild).toHaveClass("my-custom-calendar");
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('.my-custom-month')).toBeInTheDocument(); 
  });
}); 