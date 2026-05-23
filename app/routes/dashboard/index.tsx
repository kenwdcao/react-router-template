import { Stack, Text, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { isAiConfigured } from "~/lib/ai/provider.server";
import { requireAuth } from "~/lib/auth/index.server";
import { env } from "~/lib/env.server";
import { listProjectsForUser } from "~/lib/projects.server";
import {
  QuickActions,
  RecentProjects,
  StatCards,
} from "~/ui/components/dashboard";

export function meta() {
  return [{ title: "Dashboard" }];
}

export async function loader({ request }: { request: Request }) {
  const session = await requireAuth(request);
  const projects = await listProjectsForUser(session.user.id);

  return {
    projectCount: projects.length,
    recentProjects: projects.slice(0, 5),
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
