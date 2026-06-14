import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "../Sidebar";

vi.mock("react-router", () => ({
  useLocation: () => ({ pathname: "/admin/users" }),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("Admin Sidebar", () => {
  it("renders the Management group", () => {
    renderWithMantine(<Sidebar />);

    expect(screen.getByText("Management")).toBeInTheDocument();
  });

  it("renders Users and Projects navigation items", () => {
    renderWithMantine(<Sidebar />);

    expect(screen.getAllByText("Users").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Projects").length).toBeGreaterThan(0);
  });
});
