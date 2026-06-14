import { Button, Card, Group, ScrollArea, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import type {
  ProjectManagerOption,
  ProjectWithManagers,
} from "~/lib/admin/types";
import {
  AdminSearchInput,
  TablePagination,
  type TablePaginationProps,
} from "~/ui/components/common";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectsTable } from "./ProjectsTable";

export interface AdminProjectsPageProps {
  projects: ProjectWithManagers[];
  pagination: Omit<TablePaginationProps, "onPageChange" | "onPageSizeChange">;
  clients: string[];
  availableManagers: ProjectManagerOption[];
  formatDate: (date: Date) => string;
}

export function AdminProjectsPage({
  projects,
  pagination,
  clients,
  availableManagers,
  formatDate,
}: AdminProjectsPageProps) {
  const [, setSearchParams] = useSearchParams();
  const [createModalOpened, setCreateModalOpened] = useState(false);

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
      <Group
        justify="space-between"
        align="center"
        mb="md"
        className="flex-wrap gap-y-2"
      >
        <Title order={2} size="h4">
          Project Management
        </Title>
        <Button
          onClick={() => setCreateModalOpened(true)}
          leftSection={<Plus size={16} />}
        >
          Create Project
        </Button>
      </Group>
      <Group mb="md" className="w-full">
        <AdminSearchInput placeholder="Search by name, client, or PM..." />
      </Group>
      {pagination.totalCount > 0 && (
        <TablePagination
          {...pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          itemLabel="projects"
        />
      )}
      <Card withBorder radius="md" p={0}>
        <ScrollArea>
          <ProjectsTable
            projects={projects}
            formatDate={formatDate}
            clients={clients}
            availableManagers={availableManagers}
          />
        </ScrollArea>
        {pagination.totalCount > 0 && (
          <TablePagination
            {...pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemLabel="projects"
          />
        )}
      </Card>
      <CreateProjectModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        clients={clients}
        availableManagers={availableManagers}
      />
    </>
  );
}
