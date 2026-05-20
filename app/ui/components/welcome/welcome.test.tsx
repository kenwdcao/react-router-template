import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Welcome } from "~/ui/components/welcome/welcome";

describe("Welcome", () => {
  it("renders resource links", () => {
    render(
      <MantineProvider>
        <Welcome />
      </MantineProvider>,
    );

    expect(
      screen.getByRole("link", { name: "React Router Docs" }),
    ).toHaveAttribute("href", "https://reactrouter.com/docs");
    expect(screen.getByRole("link", { name: "Join Discord" })).toHaveAttribute(
      "href",
      "https://rmx.as/discord",
    );
  });
});
