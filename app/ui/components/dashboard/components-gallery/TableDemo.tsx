import {
  Badge,
  Pagination,
  Paper,
  Table,
  Title,
} from "@mantine/core";
import { useState } from "react";

interface DemoRow {
  id: number;
  name: string;
  status: "Active" | "Pending" | "Archived";
  date: string;
}

const demoData: DemoRow[] = [
  { id: 1, name: "Customer portal", status: "Active", date: "2025-01-15" },
  { id: 2, name: "Internal toolkit", status: "Pending", date: "2025-01-14" },
  { id: 3, name: "Marketing site", status: "Active", date: "2025-01-13" },
  { id: 4, name: "Mobile API", status: "Archived", date: "2025-01-12" },
  { id: 5, name: "Admin dashboard", status: "Active", date: "2025-01-11" },
  { id: 6, name: "Analytics pipeline", status: "Pending", date: "2025-01-10" },
  { id: 7, name: "Payment service", status: "Active", date: "2025-01-09" },
  { id: 8, name: "User onboarding", status: "Archived", date: "2025-01-08" },
  { id: 9, name: "Email templates", status: "Active", date: "2025-01-07" },
  { id: 10, name: "CI/CD pipeline", status: "Pending", date: "2025-01-06" },
];

const PAGE_SIZE = 5;

export function TableDemo() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(demoData.length / PAGE_SIZE);
  const paginatedRows = demoData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const statusColor = (status: DemoRow["status"]) => {
    switch (status) {
      case "Active":
        return "green" as const;
      case "Pending":
        return "yellow" as const;
      case "Archived":
        return "gray" as const;
    }
  };

  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Table &amp; Pagination
      </Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedRows.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.id}</Table.Td>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>
                <Badge color={statusColor(row.status)} variant="light" size="sm">
                  {row.status}
                </Badge>
              </Table.Td>
              <Table.Td>{row.date}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Pagination
        total={totalPages}
        value={page}
        onChange={setPage}
        mt="md"
      />
    </Paper>
  );
}
