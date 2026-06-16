import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("opens a dropdown linking to /settings and exposing sign out", async () => {
    renderWithMantine(<UserMenu user={user} />);

    fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));

    // Mantine renders the dropdown into a portal and animates it open. Query the
    // rendered items visibility-agnostically: the Settings item is a Menu.Item
    // rendered with component={Link} (surfaces as the anchor, no explicit
    // menuitem role in the mocked Link); Sign out is queried by text to match.
    const settingsItem = await screen.findByTestId("link-/settings");
    expect(settingsItem).toHaveAttribute("href", "/settings");
    expect(settingsItem).toHaveTextContent("Settings");

    expect(await screen.findByText("Sign out")).toBeInTheDocument();
  });

  it("signs out and navigates home when sign out is clicked", async () => {
    renderWithMantine(<UserMenu user={user} />);

    fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));

    // The dropdown items render into a portal asynchronously after opening.
    // Query visibility-agnostically (Mantine animates open via display toggling
    // which can lag in jsdom) and click the Sign out item once it appears.
    const signOutItem = await screen.findByText("Sign out");
    fireEvent.click(signOutItem);

    expect(signOutMock).toHaveBeenCalledTimes(1);
    // handleSignOut awaits signOut() before calling navigate("/"), so the
    // navigation happens on a later microtask than the click.
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
