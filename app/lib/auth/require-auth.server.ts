import { redirect } from "react-router";
import { getSafeRedirectTo } from "~/lib/auth";
import { auth } from "~/lib/auth/index.server";

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function requireAuth(
  request: Request,
  redirectTo = new URL(request.url).pathname,
): Promise<AuthSession> {
  const session = await getSession(request);

  if (!session) {
    const params = new URLSearchParams({ redirectTo });
    throw redirect(`/login?${params.toString()}`);
  }

  return session;
}

export async function requireAnonymous(request: Request, redirectTo = "/") {
  const session = await getSession(request);

  if (session) {
    throw redirect(redirectTo);
  }

  return null;
}

export { getSafeRedirectTo };
