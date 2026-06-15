import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
const signOutMock = vi.fn();

vi.mock("react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid={`link-${to}`}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("~/lib/auth", () => ({
  signOut: (): Promise<void> => Promise.resolve(signOutMock()),
}));

import { UserMenu } from "../UserMenu";

const user = { name: "Jane Worker", email: "jane@example.com" };

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("UserMenu", () => {
  it("renders the avatar button with the account label", () => {
    renderWithMantine(<UserMenu user={user} />);

    expect(
      screen.getByRole("button", { name: "Open account menu" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jane Worker")).toBeInTheDocument();
  });

  it("falls back to the email as the display name", () => {
    renderWithMantine(
      <UserMenu user={{ name: "", email: "jane@example.com" }} />,
    );

    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("opens a dropdown linking to /settings and exposing sign out", () => {
    renderWithMantine(<UserMenu user={user} />);

    fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));

    // Settings is a real anchor (rendered via Link → href).
    const settingsLink = screen.getByTestId("link-/settings");
    expect(settingsLink).toHaveAttribute("href", "/settings");
    expect(settingsLink).toHaveTextContent("Settings");

    // Sign out is present as a menu item.
    expect(
      screen.getByRole("menuitem", { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it("signs out and navigates home when sign out is clicked", () => {
    renderWithMantine(<UserMenu user={user} />);

    fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
