import { betterAuth } from "better-auth";
import { pool } from "~/lib/db/index.server";
import { env } from "~/lib/env.server";

export const auth = betterAuth({
  appName: "React Router Template",
  baseURL: env.BETTER_AUTH_URL,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  secret: env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,
});
