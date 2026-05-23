import { Skeleton, Stack, Text, Timeline } from "@mantine/core";
import { Pencil, Plus } from "lucide-react";

export interface ActivityEvent {
  id: string;
  type: "created" | "updated";
  projectName: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <Stack gap="xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={40} radius="sm" />
        ))}
      </Stack>
    );
  }

  return (
    <Timeline active={events.length} bulletSize={24} lineWidth={2}>
      {events.map((event) => {
        const Icon = event.type === "created" ? Plus : Pencil;

        return (
          <Timeline.Item
            key={event.id}
            bullet={<Icon size={14} />}
            title={
              <Text size="sm" fw={500}>
                {event.projectName}
              </Text>
            }
          >
            <Text size="xs" c="dimmed">
              {event.type === "created" ? "Project created" : "Project updated"}{" "}
              &middot; {formatRelativeTime(event.timestamp)}
            </Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
