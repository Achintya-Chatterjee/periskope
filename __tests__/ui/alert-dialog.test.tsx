import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

describe("AlertDialog Component", () => {
  const DialogWithTrigger = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Open Dialog</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  test(" should renders trigger and dialog is initially hidden", () => {
    render(<DialogWithTrigger />);
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("should opens dialog on trigger click, displays content, and has correct role", async () => {
    render(<DialogWithTrigger />);
    const triggerButton = screen.getByText("Open Dialog");
    fireEvent.click(triggerButton);

    const alertDialog = await screen.findByRole("alertdialog");
    expect(alertDialog).toBeInTheDocument();

    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  test("should closes dialog when AlertDialogCancel is clicked", async () => {
    render(<DialogWithTrigger />);
    fireEvent.click(screen.getByText("Open Dialog"));

    const alertDialog = await screen.findByRole("alertdialog");
    expect(alertDialog).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  test("should closes dialog when AlertDialogAction is clicked (if not prevented)", async () => {
    render(<DialogWithTrigger />);
    fireEvent.click(screen.getByText("Open Dialog"));

    const alertDialog = await screen.findByRole("alertdialog");
    expect(alertDialog).toBeInTheDocument();

    const continueButton = screen.getByText("Continue");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  test("should AlertDialogTitle and AlertDialogDescription are correctly identified", async () => {
    render(<DialogWithTrigger />);
    fireEvent.click(screen.getByText("Open Dialog"));

    const alertDialog = await screen.findByRole("alertdialog");

    const titleId = alertDialog.getAttribute("aria-labelledby");
    const descriptionId = alertDialog.getAttribute("aria-describedby");

    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();

    // eslint-disable-next-line testing-library/no-node-access
    const titleElement = document.getElementById(titleId!);
    // eslint-disable-next-line testing-library/no-node-access
    const descriptionElement = document.getElementById(descriptionId!);

    expect(titleElement).toHaveTextContent("Are you absolutely sure?");
    expect(descriptionElement).toHaveTextContent(
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
    );
  });
});
