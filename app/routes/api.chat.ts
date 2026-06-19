import { convertToModelMessages, safeValidateUIMessages, streamText } from "ai";
import { getProjectKnowledge } from "~/lib/ai/knowledge.server";
import { AiNotConfiguredError, getAiProvider } from "~/lib/ai/provider.server";
import { requireAuth } from "~/lib/auth/index.server";
import type { Route } from "./+types/api.chat";

type JsonResult =
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
    };

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJson(request: Request): Promise<JsonResult> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return { ok: false };
  }
}

export async function action({ request, url }: Route.ActionArgs) {
  await requireAuth(request, url.pathname);

  const body = await readJson(request);
  if (!body.ok) {
    return jsonError("Request body must be valid JSON.", 400);
  }

  if (!isRecord(body.value)) {
    return jsonError("Request body must be a JSON object.", 400);
  }

  const messagesResult = await safeValidateUIMessages({
    messages: body.value.messages,
  });

  if (!messagesResult.success || messagesResult.data.length === 0) {
    return jsonError(
      "Request body must include a valid non-empty AI SDK UI messages array.",
      400,
    );
  }

  let provider: ReturnType<typeof getAiProvider>;
  try {
    provider = getAiProvider();
  } catch (error) {
    if (error instanceof AiNotConfiguredError) {
      return jsonError(error.message, 503);
    }

    throw error;
  }

  const messages = messagesResult.data;
  const result = streamText({
    model: provider,
    system: getProjectKnowledge(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
