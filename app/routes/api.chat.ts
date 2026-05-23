import { streamText, convertToModelMessages } from "ai";
import { requireAuth } from "~/lib/auth/index.server";
import { getAiProvider } from "~/lib/ai/provider.server";
import { getProjectKnowledge } from "~/lib/ai/knowledge.server";
import type { Route } from "./+types/api.chat";

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);
  const { messages } = await request.json();
  const provider = getAiProvider();
  const result = streamText({
    model: provider,
    system: getProjectKnowledge(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1024,
  });
  return result.toUIMessageStreamResponse();
}
