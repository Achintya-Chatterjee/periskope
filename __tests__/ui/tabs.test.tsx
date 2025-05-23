"use client";

import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
  cn: jest.fn((...inputs) =>
    inputs
      .flat(Infinity)
      .filter(
        (input) =>
          typeof input === "string" ||
          (typeof input === "object" && input !== null)
      )
      .map((input) => {
        if (
          typeof input === "object" &&
          input !== null &&
          !Array.isArray(input)
        ) {
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

describe("Tabs Components", () => {
  const TestTabsComponent = ({
    defaultValue = "account",
  }: {
    defaultValue?: string;
  }) => (
    <Tabs defaultValue={defaultValue} data-testid="tabs-root">
      <TabsList data-testid="tabs-list">
        <TabsTrigger value="account" data-testid="trigger-account">
          Account
        </TabsTrigger>
        <TabsTrigger value="password" data-testid="trigger-password">
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" data-testid="content-account">
        Account Content
      </TabsContent>
      <TabsContent value="password" data-testid="content-password">
        Password Content
      </TabsContent>
    </Tabs>
  );

  describe("Tabs (Root)", () => {
    it("should render with default value and display corresponding content", () => {
      render(<TestTabsComponent />);
      expect(screen.getByTestId("tabs-root")).toBeInTheDocument();
      expect(screen.getByTestId("content-account")).toBeVisible();
      expect(screen.getByText("Account Content")).toBeVisible();
      expect(screen.queryByTestId("content-password")).not.toBeVisible();
    });

    it("should apply custom className to Tabs root", () => {
      render(
        <Tabs
          defaultValue="test"
          className="my-tabs-root"
          data-testid="custom-tabs"
        >
          <TabsList>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
          <TabsContent value="test">Test Content</TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId("custom-tabs")).toHaveClass("my-tabs-root");
    });
  });

  describe("TabsList", () => {
    it("should render TabsList with triggers", () => {
      render(<TestTabsComponent />);
      const list = screen.getByTestId("tabs-list");
      expect(list).toBeInTheDocument();
      expect(screen.getByTestId("trigger-account")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-password")).toBeInTheDocument();
    });

    it("should apply custom className to TabsList", () => {
      render(
        <Tabs defaultValue="test">
          <TabsList className="my-custom-list" data-testid="custom-list">
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId("custom-list")).toHaveClass("my-custom-list");
    });

    it("should forward ref to TabsList", () => {
      const ref = React.createRef<React.ElementRef<typeof TabsList>>();
      render(
        <Tabs defaultValue="test">
          <TabsList ref={ref}>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("TabsTrigger", () => {
    it("should render TabsTrigger with text", () => {
      render(<TestTabsComponent />);
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
    });

    it("should have correct data-state and ARIA attributes for active and inactive triggers", () => {
      render(<TestTabsComponent defaultValue="account" />);
      const accountTrigger = screen.getByTestId("trigger-account");
      const passwordTrigger = screen.getByTestId("trigger-password");

      expect(accountTrigger).toHaveAttribute("data-state", "active");
      expect(accountTrigger).toHaveAttribute("aria-selected", "true");
      expect(passwordTrigger).toHaveAttribute("data-state", "inactive");
      expect(passwordTrigger).toHaveAttribute("aria-selected", "false");
    });

    it("should apply custom className to TabsTrigger", () => {
      render(
        <Tabs defaultValue="test">
          <TabsList>
            <TabsTrigger
              value="test"
              className="my-trigger"
              data-testid="custom-trigger"
            >
              Test
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByTestId("custom-trigger")).toHaveClass("my-trigger");
    });

    it("should forward ref to TabsTrigger", () => {
      const ref = React.createRef<React.ElementRef<typeof TabsTrigger>>();
      render(
        <Tabs defaultValue="test">
          <TabsList>
            <TabsTrigger value="test" ref={ref}>
              Test
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should be disabled if disabled prop is true", () => {
      render(
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account" data-testid="trigger-1">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" data-testid="trigger-2" disabled>
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" data-testid="content-1">
            Account Content
          </TabsContent>
          <TabsContent value="password" data-testid="content-2">
            Password Content
          </TabsContent>
        </Tabs>
      );
      const trigger1 = screen.getByTestId("trigger-1");
      const trigger2 = screen.getByTestId("trigger-2");
      const content1 = screen.getByTestId("content-1");
      const content2 = screen.getByTestId("content-2");

      expect(trigger2).toBeDisabled();
      expect(trigger2).toHaveClass("disabled:opacity-50");

      fireEvent.click(trigger2);
      expect(content1).toBeVisible();
      expect(content2).not.toBeVisible();
      expect(trigger1).toHaveAttribute("data-state", "active");
      expect(trigger2).toHaveAttribute("data-state", "inactive");
    });
  });

  describe("TabsContent", () => {
    it("should render active TabsContent and hide inactive", () => {
      render(<TestTabsComponent defaultValue="password" />);
      expect(screen.getByTestId("content-password")).toBeVisible();
      expect(screen.getByText("Password Content")).toBeVisible();
      expect(screen.queryByTestId("content-account")).not.toBeVisible();
    });

    it("should apply custom className to TabsContent", () => {
      render(
        <Tabs defaultValue="test">
          <TabsList>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
          <TabsContent
            value="test"
            className="my-content"
            data-testid="custom-content"
          >
            Test Content
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId("custom-content")).toHaveClass("my-content");
    });

    it("should forward ref to TabsContent", () => {
      const ref = React.createRef<React.ElementRef<typeof TabsContent>>();
      render(
        <Tabs defaultValue="test">
          <TabsList>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
          <TabsContent value="test" ref={ref}>
            Test Content
          </TabsContent>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
