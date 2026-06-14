import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { NotFoundPage } from "~/ui/components/common";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <MantineProvider>{children}</MantineProvider>
    </BrowserRouter>
  );
}

afterEach(cleanup);

describe("NotFoundPage", () => {
  it("renders the 404 code", () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(screen.getByLabelText("404")).toBeInTheDocument();
  });

  it("renders the heading", () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(screen.getByText(/the page may have moved/i)).toBeInTheDocument();
  });

  it("renders home and dashboard links", () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const dashboardLink = screen.getByRole("link", {
      name: /open dashboard/i,
    });
    expect(dashboardLink).toHaveAttribute("href", "/demo/dashboard");
  });
});
