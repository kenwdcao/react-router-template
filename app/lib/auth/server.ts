import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { pool } from "~/lib/db/index.server";
import { env } from "~/lib/env.server";
import { getMicrosoftOAuthUserInfo } from "./microsoft-profile.server";

export const isMicrosoftSSOConfigured = Boolean(
  env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET,
);

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
    // Cookie cache disabled when Microsoft SSO is active: OAuth tokens make
    // the session cookie too large for some reverse-proxy response-header
    // limits, causing 502 errors on the OAuth callback.
    cookieCache: {
      enabled: !isMicrosoftSSOConfigured,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,
  // The admin plugin is enabled solely to provide the `banned`/`banReason`/
  // `banExpires` user columns, the `impersonatedBy` session column, and the
  // automatic login-time ban check. Admin authorization itself is gated by the
  // ADMIN_EMAILS env list (see app/lib/auth/require-admin.server.ts), not by
  // the plugin's role-based checks.
  plugins: [admin()],
  ...(isMicrosoftSSOConfigured
    ? {
        socialProviders: {
          microsoft: {
            // Guarded by isMicrosoftSSOConfigured check above.
            clientId: env.MICROSOFT_CLIENT_ID ?? "",
            clientSecret: env.MICROSOFT_CLIENT_SECRET ?? "",
            tenantId: env.MICROSOFT_TENANT_ID ?? "common",
            getUserInfo: getMicrosoftOAuthUserInfo,
            overrideUserInfoOnSignIn: true,
          },
        },
      }
    : {}),
});
