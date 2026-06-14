import { ActionIcon, Tooltip } from "@mantine/core";
import { Pencil } from "lucide-react";

interface EditProjectDrawerButtonProps {
  onClick: () => void;
}

export function EditProjectDrawerButton({
  onClick,
}: EditProjectDrawerButtonProps) {
  return (
    <Tooltip label="Edit project" position="top">
      <ActionIcon
        variant="light"
        color="blue"
        aria-label="Edit project"
        onClick={onClick}
      >
        <Pencil size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
