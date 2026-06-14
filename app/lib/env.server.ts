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
  MICROSOFT_CLIENT_ID: optionalEnvString,
  MICROSOFT_CLIENT_SECRET: optionalEnvString,
  MICROSOFT_TENANT_ID: optionalEnvString,
  AI_BASE_URL: optionalEnvUrl,
  AI_API_KEY: optionalEnvString,
  AI_MODEL_ID: optionalEnvString,
  // Space-separated allow-list of admin emails. Whitespace-separated so a single
  // value can hold multiple addresses without comma/quoting friction in shells.
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(/\s+/)
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
        : [],
    ),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function parseEnv(rawEnv: NodeJS.ProcessEnv): ServerEnv {
  return envSchema.parse(rawEnv);
}

export const env = parseEnv(process.env);
