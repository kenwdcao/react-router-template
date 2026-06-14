import { env } from "~/lib/env.server";
import { requireAuth, type AuthSession } from "./require-auth.server";

/** The lowercased ADMIN_EMAILS allow-list. Read fresh so test/seed overrides apply. */
function adminEmails(): Set<string> {
  return new Set(env.ADMIN_EMAILS);
}

/** Whether `email` is on the ADMIN_EMAILS allow-list. Case-insensitive. */
export function isAdminEmail(email: string): boolean {
  return adminEmails().has(email.trim().toLowerCase());
}

/**
 * Require a signed-in admin (a user whose email is on the ADMIN_EMAILS list).
 * Unauthenticated users are redirected to /login by `requireAuth`; signed-in
 * non-admins receive a 403. Returns the session on success.
 */
export async function requireAdmin(request: Request): Promise<AuthSession> {
  const session = await requireAuth(request);
  if (!isAdminEmail(session.user.email)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}
