import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  ...jest.requireActual("next-themes"),
  ThemeProvider: jest.fn(({ children }, context) => (
    <div data-testid="next-themes-provider">{children}</div>
  )),
  useTheme: jest.fn(),
}));

describe("ThemeProvider Component", () => {
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    (jest.requireMock("next-themes").ThemeProvider as jest.Mock).mockClear();
    mockUseTheme.mockClear();
  });

  test("should render children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child-div">Hello World</div>
      </ThemeProvider>
    );
    const childElement = screen.getByTestId("child-div");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Hello World");
  });

  test("should pass props to NextThemesProvider", () => {
    const NextThemesProviderMock =
      jest.requireMock("next-themes").ThemeProvider;
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div>Child</div>
      </ThemeProvider>
    );

    expect(NextThemesProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: "class",
        defaultTheme: "dark",
        enableSystem: true,
        children: expect.anything(),
      }),
      undefined
    );
  });

  test("should render NextThemesProvider with children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child-content">Test Child</div>
      </ThemeProvider>
    );
    const nextThemesProvider = screen.getByTestId("next-themes-provider");
    expect(nextThemesProvider).toBeInTheDocument();
    const childContent = screen.getByTestId("child-content");
    expect(nextThemesProvider).toContainElement(childContent);
  });
});
