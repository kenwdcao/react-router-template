import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCards } from "../StatCards";

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("StatCards", () => {
  it("renders KPI labels with values from props", () => {
    renderWithMantine(
      <StatCards
        projectCount={5}
        lastLogin="Today"
        environment="Development"
        aiReady
      />,
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("shows not configured badge when AI is not ready", () => {
    renderWithMantine(
      <StatCards
        projectCount={0}
        lastLogin={null}
        environment="Production"
        aiReady={false}
      />,
    );

    expect(screen.getByText("Not configured")).toBeInTheDocument();
  });
});
