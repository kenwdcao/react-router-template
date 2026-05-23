import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "../Sidebar";

vi.mock("react-router", () => ({
  useLocation: () => ({ pathname: "/dashboard" }),
  Link: ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} data-testid={`link-${to}`} aria-label={typeof children === "string" ? children : to}>
      {children}
    </a>
  ),
}));

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("Sidebar", () => {
  it("renders all nav groups", () => {
    renderWithMantine(<Sidebar />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Demos")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    renderWithMantine(<Sidebar />);

    expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Projects").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Activity").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Components").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI Chat").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
  });
});
