import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

describe("Accordion Component", () => {
  const testItems = [
    {
      value: "item-1",
      triggerText: "Is it accessible?",
      contentText: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      value: "item-2",
      triggerText: "Is it styled?",
      contentText:
        "Yes. It comes with default styles that matches the other components' aesthetic.",
    },
  ];

  test(" should renders accordion with multiple items", () => {
    render(
      <Accordion type="multiple">
        {testItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.triggerText}</AccordionTrigger>
            <AccordionContent>{item.contentText}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );

    testItems.forEach((item) => {
      expect(screen.getByText(item.triggerText)).toBeInTheDocument();
      expect(screen.queryByText(item.contentText)).not.toBeInTheDocument();
    });
  });

  test("should opens and closes accordion item on click (single type)", async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value={testItems[0].value}>
          <AccordionTrigger>{testItems[0].triggerText}</AccordionTrigger>
          <AccordionContent>{testItems[0].contentText}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText(testItems[0].triggerText);

    expect(
      screen.queryByText(testItems[0].contentText)
    ).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(await screen.findByText(testItems[0].contentText)).toBeVisible();

    fireEvent.click(trigger);

    expect(
      screen.queryByText(testItems[0].contentText)
    ).not.toBeInTheDocument();
  });

  test(" should AccordionTrigger has correct aria attributes", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByText("Trigger 1");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-state", "open");
  });

  test(" should AccordionContent has correct data-state and transitions", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>
            <div data-testid="content-div">Content 1</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const contentDiv = screen.getByTestId("content-div");
    const accordionContentElement = contentDiv.closest('[role="region"]');
    const trigger = screen.getByText("Trigger 1");

    expect(accordionContentElement).toHaveAttribute("data-state", "open");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(contentDiv).toBeVisible();

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    expect(accordionContentElement).toHaveAttribute("data-state", "closed");
    expect(contentDiv).not.toBeVisible();
  });
});
