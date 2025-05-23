import React from "react";
import { render, screen } from "@testing-library/react";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockActualSonnerComponent = jest.fn((props) => {
  return (
    <div
      data-testid="mock-sonner"
      data-theme={props.theme}
      className={props.className}
    />
  );
});

jest.mock("sonner", () => ({
  Toaster: (props: any) => mockActualSonnerComponent(props),
}));

const mockedUseTheme = useTheme as jest.Mock;

describe("Toaster Component (from ui/sonner)", () => {
  beforeEach(() => {
    mockedUseTheme.mockClear();
    mockActualSonnerComponent.mockClear();

    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  test('should render Sonner with default theme "system" when useTheme provides no theme', () => {
    mockedUseTheme.mockReturnValue({});
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledTimes(1);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "system",
        className: "toaster group",
      })
    );
  });

  test("should render Sonner with theme from useTheme hook", () => {
    mockedUseTheme.mockReturnValue({ theme: "dark" });
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledTimes(1);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "dark",
      })
    );
  });

  test('should pass "light" theme from useTheme to Sonner', () => {
    mockedUseTheme.mockReturnValue({ theme: "light" });
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "light",
      })
    );
  });

  test("should pass through additional props to Sonner", () => {
    mockedUseTheme.mockReturnValue({ theme: "system" });
    const customProps = {
      position: "top-center",
      richColors: true,
      duration: 5000,
    } as const;
    render(<Toaster {...customProps} />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining(customProps)
    );
  });

  test("should pass the correct className and default toastOptions.classNames to Sonner", () => {
    mockedUseTheme.mockReturnValue({ theme: "system" });
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        className: "toaster group",
        toastOptions: {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        },
      })
    );
  });

  test("should merge custom props with default props, with custom props taking precedence for shared keys", () => {
    mockedUseTheme.mockReturnValue({ theme: "system" });
    render(
      <Toaster
        className="custom-toaster-class"
        theme="dark"
        position="bottom-right"
      />
    );

    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "dark",
        className: "custom-toaster-class",
        position: "bottom-right",
        toastOptions: {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        },
      })
    );
  });

  test("should use theme from props if provided, otherwise use theme from useTheme", () => {
    mockedUseTheme.mockReturnValue({ theme: "dark" });
    render(<Toaster theme="light" />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "light",
      })
    );
    mockActualSonnerComponent.mockClear();

    mockedUseTheme.mockReturnValue({ theme: "dark" });
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "dark",
      })
    );
    mockActualSonnerComponent.mockClear();

    mockedUseTheme.mockReturnValue({});
    render(<Toaster />);
    expect(mockActualSonnerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "system",
      })
    );
  });
});
