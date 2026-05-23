import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { env } from "~/lib/env.server";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI is not configured. Set AI_BASE_URL, AI_API_KEY, and AI_MODEL_ID in .env");
    this.name = "AiNotConfiguredError";
  }
}

export function isAiConfigured(): boolean {
  return Boolean(env.AI_BASE_URL && env.AI_API_KEY && env.AI_MODEL_ID);
}

export function getAiProvider() {
  if (!env.AI_BASE_URL || !env.AI_API_KEY || !env.AI_MODEL_ID) {
    throw new AiNotConfiguredError();
  }

  const provider = createOpenAICompatible({
    baseURL: env.AI_BASE_URL,
    apiKey: env.AI_API_KEY,
    name: "openai-compatible",
  });

  return provider.chatModel(env.AI_MODEL_ID);
}
