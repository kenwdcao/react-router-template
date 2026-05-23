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
  it("renders CTA links to /dashboard and /register", () => {
    render(<Hero />, { wrapper: Wrapper });
    expect(
      screen.getByRole("link", { name: /View Dashboard Demo/i }),
    ).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /Get Started/i })).toHaveAttribute(
      "href",
      "/register",
    );
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
    expect(
      screen.getByRole("link", { name: /View dashboard demo/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
