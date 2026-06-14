import { Stack, Text, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { requireAuth } from "~/lib/auth/index.server";
import { listProjectsForUser } from "~/lib/demo/projects.server";
import {
  ActivityTimeline,
  EmptyActivity,
  type ActivityEvent,
} from "~/ui/demo/dashboard/activity";
import type { Route } from "./+types/activity";

export function meta() {
  return [{ title: "Activity" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuth(request);
  const projects = await listProjectsForUser(session.user.id);
  const recent = projects.slice(0, 10);

  // Stopgap: synthesize events from project timestamps until a real audit table exists.
  const events: ActivityEvent[] = recent.map((project, index) => ({
    id: project.id,
    type: index === 0 ? "created" : "updated",
    projectName: project.name,
    timestamp: project.updatedAt.toISOString(),
  }));

  return { events };
}

export default function ActivityRoute() {
  const { events } = useLoaderData<typeof loader>();

  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Activity</Title>
        <Text c="dimmed">Recent project events and updates.</Text>
      </div>

      {events.length === 0 ? (
        <EmptyActivity />
      ) : (
        <ActivityTimeline events={events} />
      )}
    </Stack>
  );
}
