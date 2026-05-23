import { Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { Plus, Search } from "lucide-react";

interface ProjectsToolbarProps {
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function ProjectsToolbar({
  onCreateClick,
  onSearchChange,
  onStatusChange,
}: ProjectsToolbarProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group gap="md" wrap="nowrap">
        <TextInput
          placeholder="Search projects..."
          leftSection={<Search size={16} />}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          aria-label="Search projects"
        />
        <SegmentedControl
          data={statusOptions}
          defaultValue="all"
          onChange={onStatusChange}
          aria-label="Filter by status"
        />
      </Group>
      <Button
        leftSection={<Plus size={16} />}
        onClick={onCreateClick}
      >
        Create project
      </Button>
    </Group>
  );
}
