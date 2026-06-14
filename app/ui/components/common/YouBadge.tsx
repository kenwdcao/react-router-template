import { Badge } from "@mantine/core";

interface YouBadgeProps {
  /** Whether to render the badge. The server decides via currentUserId. */
  show: boolean;
}

/** Small "You" marker shown next to the current user's row. */
export function YouBadge({ show }: YouBadgeProps) {
  if (!show) return null;
  return (
    <Badge variant="light" color="gray" size="xs">
      You
    </Badge>
  );
}
