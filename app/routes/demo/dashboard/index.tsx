import { Stack, Text, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { isAiConfigured } from "~/lib/ai/provider.server";
import { requireAuth } from "~/lib/auth/index.server";
import {
  countProjectsForUser,
  listRecentProjectsForUser,
} from "~/lib/demo/projects.server";
import { env } from "~/lib/env.server";
import { QuickActions, RecentProjects, StatCards } from "~/ui/demo/dashboard";

export function meta() {
  return [{ title: "Dashboard" }];
}

export async function loader({ request }: { request: Request }) {
  const session = await requireAuth(request);
  const [projectCount, recentProjects] = await Promise.all([
    countProjectsForUser(session.user.id),
    listRecentProjectsForUser(session.user.id, 5),
  ]);

  return {
    projectCount,
    recentProjects,
    environment: env.BETTER_AUTH_URL.includes("localhost")
      ? "Development"
      : "Production",
    aiReady: isAiConfigured(),
  };
}

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Dashboard</Title>
        <Text c="dimmed">
          Protected layout route with shared navigation and session context.
        </Text>
      </div>

      <StatCards
        projectCount={data.projectCount}
        lastLogin={null}
        environment={data.environment}
        aiReady={data.aiReady}
      />

      <QuickActions />

      <RecentProjects projects={data.recentProjects} />
    </Stack>
  );
}
