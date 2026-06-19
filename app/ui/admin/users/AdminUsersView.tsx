import { Card, Group, ScrollArea, Title } from "@mantine/core";
import { useSearchParams } from "react-router";
import {
  AdminSearchInput,
  TablePagination,
  type TablePaginationProps,
} from "~/ui/components/common";
import { UsersTable, type AdminUserTableRow } from "./UsersTable";

export interface AdminUsersViewProps {
  users: AdminUserTableRow[];
  currentUserId: string;
  pagination: Omit<TablePaginationProps, "onPageChange" | "onPageSizeChange">;
  formatDate: (date: Date) => string;
}

export function AdminUsersView({
  users,
  currentUserId,
  pagination,
  formatDate,
}: AdminUsersViewProps) {
  const [, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const handlePageSizeChange = (newPageSize: string | null) => {
    if (!newPageSize) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("pageSize", newPageSize);
      next.set("page", "1");
      return next;
    });
  };

  return (
    <>
      <Title order={2} mb="xs" size="h5">
        User Management
      </Title>
      <Group mb="xs" className="w-full">
        <AdminSearchInput placeholder="Search by name or email..." />
      </Group>
      {pagination.totalCount > 0 && (
        <TablePagination
          {...pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          itemLabel="users"
        />
      )}
      <Card withBorder radius="md" p={0}>
        <ScrollArea>
          <UsersTable
            users={users}
            currentUserId={currentUserId}
            formatDate={formatDate}
          />
        </ScrollArea>
        {pagination.totalCount > 0 && (
          <TablePagination
            {...pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemLabel="users"
          />
        )}
      </Card>
    </>
  );
}
