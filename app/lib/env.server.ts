import "dotenv/config";
import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

const optionalEnvUrl = z.preprocess(emptyStringToUndefined, z.url().optional());
const optionalEnvString = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url().default("http://localhost:5173"),
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean)
        : [],
    ),
  AI_BASE_URL: optionalEnvUrl,
  AI_API_KEY: optionalEnvString,
  AI_MODEL_ID: optionalEnvString,
});

export type ServerEnv = z.infer<typeof envSchema>;

export function parseEnv(rawEnv: NodeJS.ProcessEnv): ServerEnv {
  return envSchema.parse(rawEnv);
}

export const env = parseEnv(process.env);
