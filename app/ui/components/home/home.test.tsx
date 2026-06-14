import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { FeatureGrid, FinalCTA, Hero } from "~/ui/components/home";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <MantineProvider>{children}</MantineProvider>
    </BrowserRouter>
  );
}

describe("Hero", () => {
  it("renders CTA links to /demo/dashboard and /register", () => {
    render(<Hero />, { wrapper: Wrapper });
    // visibleFrom + hiddenFrom both render in JSDOM (no CSS media queries)
    const dashboardLinks = screen.getAllByRole("link", {
      name: /View Dashboard Demo/i,
    });
    // Desktop set has aria-hidden, so only the mobile set is in the a11y tree
    expect(dashboardLinks).toHaveLength(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/demo/dashboard");

    const startedLinks = screen.getAllByRole("link", {
      name: /Get Started/i,
    });
    expect(startedLinks).toHaveLength(1);
    expect(startedLinks[0]).toHaveAttribute("href", "/register");
  });
});

describe("FeatureGrid", () => {
  it("renders all six feature titles", () => {
    render(<FeatureGrid />, { wrapper: Wrapper });
    const titles = [
      "Authentication",
      "Database",
      "Routing & SSR",
      "UI System",
      "Testing",
      "DX",
    ];
    for (const title of titles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });
});

describe("FinalCTA", () => {
  it("renders both action buttons", () => {
    cleanup();
    render(<FinalCTA />, { wrapper: Wrapper });
    const links = screen.getAllByRole("link", { name: /Get started/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/register");
    const dashboardLinks = screen.getAllByRole("link", {
      name: /View dashboard demo/i,
    });
    expect(dashboardLinks).toHaveLength(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/demo/dashboard");
  });
});
