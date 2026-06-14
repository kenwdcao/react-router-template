import { ActionIcon, Tooltip } from "@mantine/core";
import { Eye } from "lucide-react";
import { Link } from "react-router";

export function ViewProjectButton() {
  return (
    <Tooltip label="View projects" position="top">
      <ActionIcon
        component={Link}
        to="/demo/dashboard/projects"
        variant="light"
        aria-label="View projects"
        color="teal"
      >
        <Eye size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
