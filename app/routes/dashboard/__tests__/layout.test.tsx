import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const loaderState = {
  user: { email: "user@example.com", name: "Test User" },
  sidebarCollapsed: false,
};

// Mocks are hoisted. The factory closures read the shared objects lazily, so the
// mutable values are picked up at render time once the tests assign them.
vi.mock("react-router", () => ({
  useLoaderData: () => loaderState,
  useNavigate: () => () => {},
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  Outlet: () => null,
}));

vi.mock("~/lib/auth", () => ({
  signOut: vi.fn(),
}));

vi.mock("~/lib/auth/index.server", () => ({
  requireAuth: vi.fn().mockResolvedValue({
    user: { email: "user@example.com", name: "Test User" },
  }),
}));

// Keep the test focused on the layout's collapse behavior; stub the children.
vi.mock("~/ui/components/common", () => ({
  ThemeSelector: () => <div data-testid="theme-selector" />,
}));

vi.mock("~/ui/components/dashboard", () => ({
  Breadcrumbs: () => <nav data-testid="breadcrumbs" />,
  Sidebar: ({ collapsed }: { collapsed?: boolean }) => (
    <div data-testid="sidebar" data-collapsed={collapsed ? "true" : "false"} />
  ),
}));

import type { Route } from "../+types/layout";
import { default as DashboardLayout, loader } from "../layout";

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

function buildLoaderArgs(cookieHeader?: string): Route.LoaderArgs {
  const request = new Request("https://example.com/dashboard", {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  return {
    request,
    params: {},
    context: {},
    url: new URL(request.url),
    pattern: "/dashboard",
  };
}

describe("dashboard layout loader", () => {
  it("reads sidebarCollapsed=true from the request cookie", async () => {
    const data = await loader(
      buildLoaderArgs("dashboard-sidebar-collapsed=true"),
    );

    expect(data.sidebarCollapsed).toBe(true);
  });

  it("defaults to expanded when the cookie is missing", async () => {
    const data = await loader(buildLoaderArgs());

    expect(data.sidebarCollapsed).toBe(false);
  });

  it("defaults to expanded when the cookie value is invalid", async () => {
    const data = await loader(
      buildLoaderArgs("dashboard-sidebar-collapsed=maybe"),
    );

    expect(data.sidebarCollapsed).toBe(false);
  });
});

describe("dashboard layout collapse state", () => {
  beforeEach(() => {
    loaderState.sidebarCollapsed = false;
    document.cookie =
      "dashboard-sidebar-collapsed=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  afterEach(() => {
    document.cookie =
      "dashboard-sidebar-collapsed=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("renders collapsed on first paint when the loader says collapsed=true", () => {
    // The flash bug existed because SSR rendered expanded regardless of the
    // persisted value. With the loader feeding initial state, the first render
    // (before any effect) must already reflect collapsed=true.
    loaderState.sidebarCollapsed = true;

    renderWithMantine(<DashboardLayout />);

    expect(
      screen.getAllByRole("button", { name: "Expand app navigation" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders expanded on first paint when the loader says collapsed=false", () => {
    loaderState.sidebarCollapsed = false;

    renderWithMantine(<DashboardLayout />);

    expect(
      screen.getAllByRole("button", { name: "Collapse app navigation" }).length,
    ).toBeGreaterThan(0);
  });

  it("writes a collapsed=true cookie when toggling from expanded", () => {
    loaderState.sidebarCollapsed = false;

    renderWithMantine(<DashboardLayout />);

    // AppShell renders the toggle in both its mobile and desktop navbar slots;
    // both share the same handler, so the first is representative.
    const [toggle] = screen.getAllByRole("button", {
      name: "Collapse app navigation",
    });
    fireEvent.click(toggle);

    expect(document.cookie).toContain("dashboard-sidebar-collapsed=true");
  });

  it("writes a collapsed=false cookie when toggling from collapsed", () => {
    loaderState.sidebarCollapsed = true;

    renderWithMantine(<DashboardLayout />);

    const [toggle] = screen.getAllByRole("button", {
      name: "Expand app navigation",
    });
    fireEvent.click(toggle);

    expect(document.cookie).toContain("dashboard-sidebar-collapsed=false");
  });
});
