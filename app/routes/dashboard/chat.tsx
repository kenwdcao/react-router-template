import { Code, Paper, Stack, Text, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { isAiConfigured } from "~/lib/ai/provider.server";
import { requireAuth } from "~/lib/auth/index.server";
import { ChatPanel } from "~/ui/components/dashboard/chat";
import type { Route } from "./+types/chat";

export function meta() {
  return [{ title: "Chat" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  return { aiConfigured: isAiConfigured() };
}

export default function ChatRoute() {
  const { aiConfigured } = useLoaderData<typeof loader>();

  if (!aiConfigured) {
    return (
      <Stack gap="md">
        <div>
          <Title order={1}>Chat</Title>
          <Text c="dimmed">AI chatbot powered by the AI SDK.</Text>
        </div>

        <Paper withBorder p={{ base: "md", sm: "xl" }} radius="sm">
          <Stack gap="md">
            <Title order={3}>Set up AI to enable chat</Title>
            <Text>
              Copy the example env file and add your AI provider credentials:
            </Text>
            <Code block>cp .env.example .env</Code>
            <Text size="sm" c="dimmed">
              Set the following variables in your <Code>.env</Code> file:
            </Text>
            <Stack gap="xs">
              <Code>AI_BASE_URL</Code>
              <Code>AI_API_KEY</Code>
              <Code>AI_MODEL_ID</Code>
            </Stack>
            <Text size="sm" c="dimmed">
              These map to an OpenAI-compatible API endpoint. See{" "}
              <Code>.env.example</Code> for details.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack gap="md" className="h-[calc(100dvh-120px)]">
      <div>
        <Title order={1}>Chat</Title>
        <Text c="dimmed">Ask questions about this template.</Text>
      </div>

      <ChatPanel />
    </Stack>
  );
}
