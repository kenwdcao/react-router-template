import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TablePagination } from "./TablePagination";

function renderWithMantine(ui: React.ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>);
}

describe("TablePagination", () => {
  it("renders the showing-range summary with the item label", () => {
    renderWithMantine(
      <TablePagination
        page={2}
        pageSize={10}
        totalCount={25}
        totalPages={3}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        itemLabel="users"
      />,
    );

    expect(screen.getByText(/Showing 11-20 of 25 users/)).toBeInTheDocument();
  });

  it("clamps the range end to the total count on the last page", () => {
    renderWithMantine(
      <TablePagination
        page={3}
        pageSize={10}
        totalCount={25}
        totalPages={3}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        itemLabel="projects"
      />,
    );

    expect(
      screen.getByText(/Showing 21-25 of 25 projects/),
    ).toBeInTheDocument();
  });

  it("shows 0-0 when there are no items", () => {
    renderWithMantine(
      <TablePagination
        page={1}
        pageSize={10}
        totalCount={0}
        totalPages={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Showing 0-0 of 0 items/)).toBeInTheDocument();
  });
});
