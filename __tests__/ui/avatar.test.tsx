import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar Component", () => {
  test("should renders fallback when AvatarImage src is provided but image would typically fail to load in JSDOM", () => {
    const testSrc = "test-image.jpg";
    const testAlt = "Test User";
    const fallbackText = "TU";
    render(
      <Avatar>
        <AvatarImage src={testSrc} alt={testAlt} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText(fallbackText)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: testAlt })).toBeNull();
  });

  test("should renders only AvatarFallback when AvatarImage has no src", () => {
    const fallbackText = "FB";
    render(
      <Avatar>
        <AvatarImage alt="User" />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText(fallbackText)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("should renders only AvatarFallback when AvatarImage src is an empty string", () => {
    const fallbackText = "ES";
    render(
      <Avatar>
        <AvatarImage src="" alt="User" />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText(fallbackText)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("should AvatarFallback renders its children", () => {
    const fallbackText = "John Doe";
    render(
      <Avatar>
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText(fallbackText)).toBeInTheDocument();
  });

  test("should applies base classes to Avatar root", () => {
    const { container } = render(<Avatar data-testid="avatar-root" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const avatarRoot = container.firstChild;
    expect(avatarRoot).toHaveClass(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
    );
  });

  test("should applies base classes to AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback">FB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("FB")).toHaveClass(
      "flex h-full w-full items-center justify-center rounded-full bg-muted"
    );
  });
});
