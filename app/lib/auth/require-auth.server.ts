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

// `redirectTo` must be a normalized pathname (the framework-provided `url`
// sibling arg), NOT derived from `request.url`. Under React Router v8's
// pass-through requests, `request.url` keeps the `.data` suffix and internal
// routing params on data requests, so `new URL(request.url).pathname` would
// produce broken targets like `/settings.data`. Callers pass `url.pathname`.
export async function requireAuth(
  request: Request,
  redirectTo = "/",
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
