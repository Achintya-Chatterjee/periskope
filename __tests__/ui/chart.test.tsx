import { render, screen } from "@testing-library/react";

import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

jest.mock("recharts", () => {
  const OriginalRecharts = jest.requireActual("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: jest.fn(({ children }) => (
      <div
        data-testid="responsive-container"
        style={{ width: "500px", height: "300px" }}
      >
        {children}
      </div>
    )),

    Tooltip: OriginalRecharts.Tooltip,
    Legend: OriginalRecharts.Legend,
  };
});

const sampleChartData = [{ name: "A", value: 100 }];
const sampleChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
};

describe("Chart Components", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ChartContainer", () => {
    test("should render its direct children within a mocked ResponsiveContainer", () => {
      render(
        <ChartContainer config={sampleChartConfig}>
          <div data-testid="actual-child">Hello Chart</div>
        </ChartContainer>
      );
      const responsiveContainer = screen.getByTestId("responsive-container");
      expect(responsiveContainer).toBeInTheDocument();
      expect(screen.getByTestId("actual-child")).toBeInTheDocument();
      expect(screen.getByText("Hello Chart")).toBeInTheDocument();
    });

    test("should render a complex chart structure (like BarChart) as a child within mocked ResponsiveContainer", () => {
      render(
        <ChartContainer config={sampleChartConfig}>
          <BarChart data={sampleChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" />

            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      );
      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    });
  });

  describe("ChartTooltipContent", () => {
    test("should render within ChartContainer and display data", () => {
      const tooltipPayload = [
        {
          name: "value",
          value: 100,
          color: "blue",
          dataKey: "value",
          payload: sampleChartData[0],
        },
      ];
      render(
        <ChartContainer config={sampleChartConfig}>
          <>
            <Tooltip
              isAnimationActive={false}
              active={true}
              payload={tooltipPayload}
              content={<ChartTooltipContent />}
            />
            <BarChart data={sampleChartData}>
              <Bar dataKey="value" />
            </BarChart>
          </>
        </ChartContainer>
      );
      expect(screen.getAllByText("Value").length).toBeGreaterThan(0);
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  describe("ChartLegendContent", () => {
    test("should render within ChartContainer and display legend items", () => {
      const legendPayload = [
        {
          value: "value",
          type: "line" as const,
          id: "ID01",
          color: "blue",
          dataKey: "value",
        },
      ];
      render(
        <ChartContainer config={sampleChartConfig}>
          <>
            <Legend payload={legendPayload} content={<ChartLegendContent />} />
            <BarChart data={sampleChartData}>
              <Bar dataKey="value" />
            </BarChart>
          </>
        </ChartContainer>
      );

      expect(screen.getAllByText("Value").length).toBeGreaterThan(0);
    });
  });
});
