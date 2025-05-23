import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

const testSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  bio: z.string().optional(),
});
type TestFormValues = z.infer<typeof testSchema>;

const TestFormComponent = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: TestFormValues) => void;
  defaultValues?: Partial<TestFormValues>;
}) => {
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: defaultValues || { username: "", email: undefined, bio: "" },
  });

  return (
    <Form {...form}>
      <form data-testid="form-element" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem data-testid="username-item">
              <FormLabel data-testid="username-label">Username</FormLabel>
              <FormDescription data-testid="username-description">
                This is your public display name.
              </FormDescription>
              <FormControl>
                <Input
                  data-testid="username-input"
                  placeholder="Enter username"
                  {...field}
                />
              </FormControl>
              <FormMessage data-testid="username-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem data-testid="email-item">
              <FormLabel data-testid="email-label">Email (Optional)</FormLabel>
              <FormControl>
                <Input
                  data-testid="email-input"
                  placeholder="Enter email"
                  {...field}
                />
              </FormControl>

              <FormMessage data-testid="email-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem data-testid="bio-item">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input data-testid="bio-input" {...field} />
              </FormControl>

              <FormMessage data-testid="bio-message-explicit-children">
                Explicit child message
              </FormMessage>
            </FormItem>
          )}
        />

        <Button data-testid="submit-button" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

const UseFormFieldTester = () => {
  const field = useFormField();
  return (
    <div>
      <div data-testid="hook-name">{field.name}</div>
      <div data-testid="hook-id">{field.id}</div>
      <div data-testid="hook-formItemId">{field.formItemId}</div>
      <div data-testid="hook-formDescriptionId">{field.formDescriptionId}</div>
      <div data-testid="hook-formMessageId">{field.formMessageId}</div>
      {field.error && (
        <div data-testid="hook-error">{String(field.error.message)}</div>
      )}
    </div>
  );
};

const FormWithHookTester = () => {
  const form = useForm<{ testField: string }>({
    defaultValues: { testField: "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="testField"
          render={() => (
            <FormItem>
              <FormLabel>Test Field</FormLabel>
              <FormControl>
                <Input />
              </FormControl>
              <UseFormFieldTester />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

describe("Form Components", () => {
  let consoleErrorMock: jest.SpyInstance;
  beforeEach(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });
  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  test("should render form elements and link label to input", async () => {
    const handleSubmit = jest.fn();
    render(<TestFormComponent onSubmit={handleSubmit} />);

    const label = screen.getByTestId("username-label");
    const input = screen.getByTestId("username-input");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    await userEvent.click(label);
    expect(input).toHaveFocus();
  });

  test("FormControl sets correct ARIA attributes (no error)", () => {
    const handleSubmit = jest.fn();
    render(<TestFormComponent onSubmit={handleSubmit} />);

    const usernameInput = screen.getByTestId("username-input");
    const usernameItem = screen.getByTestId("username-item");
    const usernameDescription = screen.getByTestId("username-description");

    const usernameMessage = screen.queryByTestId("username-message");

    expect(usernameInput).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(usernameDescription.id)
    );
    expect(usernameMessage).not.toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("aria-invalid", "false");
  });

  test("displays error messages and updates ARIA attributes on validation error", async () => {
    const handleSubmit = jest.fn();
    render(<TestFormComponent onSubmit={handleSubmit} />);

    const usernameInput = screen.getByTestId("username-input");
    const usernameLabel = screen.getByTestId("username-label");
    const usernameDescription = screen.getByTestId("username-description");
    const submitButton = screen.getByTestId("submit-button");

    await userEvent.click(submitButton);

    let usernameMessage: HTMLElement | null;
    await waitFor(() => {
      usernameMessage = screen.getByTestId("username-message");
      expect(usernameMessage).toHaveTextContent(
        "Username must be at least 3 characters."
      );
    });
    expect(usernameLabel).toHaveClass("text-destructive");
    expect(usernameInput).toHaveAttribute("aria-invalid", "true");

    usernameMessage = screen.getByTestId("username-message");
    expect(usernameInput).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(usernameDescription.id)
    );
    expect(usernameInput).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(usernameMessage!.id)
    );
    await userEvent.type(usernameInput, "validuser");
    await waitFor(() => expect(usernameInput).toHaveValue("validuser"));

    await waitFor(() => {
      expect(screen.queryByTestId("username-message")).not.toBeInTheDocument();
    });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    const updatedUsernameLabel = screen.getByTestId("username-label");
    const updatedUsernameInput = screen.getByTestId("username-input");
    expect(screen.queryByTestId("username-message")).not.toBeInTheDocument();
    expect(updatedUsernameLabel).not.toHaveClass("text-destructive");
    expect(updatedUsernameInput).toHaveAttribute("aria-invalid", "false");
    const currentDescribedBy =
      updatedUsernameInput.getAttribute("aria-describedby");
    expect(currentDescribedBy).toEqual(usernameDescription.id);
  });

  test("FormMessage renders children if no error and children provided", () => {
    const handleSubmit = jest.fn();
    render(<TestFormComponent onSubmit={handleSubmit} />);
    const bioMessage = screen.getByTestId("bio-message-explicit-children");
    expect(bioMessage).toHaveTextContent("Explicit child message");
    expect(bioMessage).not.toHaveClass("text-destructive");
  });

  test("FormMessage renders null if no error and no children", async () => {
    const handleSubmit = jest.fn();
    render(
      <TestFormComponent
        onSubmit={handleSubmit}
        defaultValues={{ username: "valid" }}
      />
    );

    expect(screen.queryByTestId("username-message")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("submit-button"));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

    expect(screen.queryByTestId("username-message")).not.toBeInTheDocument();
  });

  test("useFormField provides correct context values", async () => {
    render(<FormWithHookTester />);

    await waitFor(() => {
      expect(screen.getByTestId("hook-name")).toHaveTextContent("testField");
      const id = screen.getByTestId("hook-id").textContent;
      expect(id).not.toBeNull();
      expect(screen.getByTestId("hook-formItemId")).toHaveTextContent(
        `${id}-form-item`
      );
      expect(screen.getByTestId("hook-formDescriptionId")).toHaveTextContent(
        `${id}-form-item-description`
      );
      expect(screen.getByTestId("hook-formMessageId")).toHaveTextContent(
        `${id}-form-item-message`
      );
    });
  });

  test("useFormField throws error if not used within FormField (no FormFieldContext)", () => {
    const ErroneousComponent = () => {
      let caughtError: Error | null = null;
      try {
        useFormField();
      } catch (e) {
        caughtError = e as Error;
      }
      expect(caughtError).not.toBeNull();
      expect(caughtError?.message).toContain(
        "useFormField should be used within <FormField>"
      );
      return <div data-testid="erroneous-component-rendered">Rendered</div>;
    };

    const TestWrapper = () => {
      const form = useForm();
      return (
        <Form {...form}>
          <FormItem>
            <ErroneousComponent />
          </FormItem>
        </Form>
      );
    };
    render(<TestWrapper />);

    expect(
      screen.getByTestId("erroneous-component-rendered")
    ).toBeInTheDocument();
  });

  test("applies custom classNames to Form components", async () => {
    const FormWithCustomClasses = () => {
      const form = useForm<TestFormValues>({
        defaultValues: { username: "testuserlong" },
        resolver: zodResolver(
          z.object({ username: z.string().max(2, { message: "Too long" }) })
        ),
      });

      React.useEffect(() => {
        form.handleSubmit(() => {})();
      }, [form]);

      return (
        <Form {...form}>
          <form
            data-testid="custom-class-form"
            onSubmit={form.handleSubmit(() => {})}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="custom-item" data-testid="item">
                  <FormLabel className="custom-label" data-testid="label">
                    Username
                  </FormLabel>
                  <FormDescription
                    className="custom-description"
                    data-testid="description"
                  >
                    Desc
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage
                    className="custom-message"
                    data-testid="message"
                  />
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    };
    render(<FormWithCustomClasses />);

    await waitFor(() => {
      expect(screen.getByTestId("message")).toBeInTheDocument();
    });

    expect(screen.getByTestId("item")).toHaveClass("custom-item");
    expect(screen.getByTestId("label")).toHaveClass("custom-label");
    expect(screen.getByTestId("description")).toHaveClass("custom-description");

    expect(screen.getByTestId("message")).toHaveClass("custom-message");
    expect(screen.getByTestId("message")).toHaveClass("text-destructive");
  });
});
