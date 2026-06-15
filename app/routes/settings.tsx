import {
  AppShell,
  Box,
  Container,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useCallback } from "react";
import {
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "react-router";
import {
  auth,
  getAuthErrorMessage,
  isAdminEmail,
  requireAuth,
} from "~/lib/auth/index.server";
import { readFormString } from "~/lib/utils";
import { ThemeSelector, TopNav, UserMenu } from "~/ui/components/common";
import { SettingsTabs } from "~/ui/settings";
import type { Route } from "./+types/settings";

export function meta() {
  return [{ title: "Settings" }];
}

interface SettingsLoaderData {
  user: { name: string; email: string };
  isAdmin: boolean;
  success?: string;
}

interface SettingsActionData {
  errors?: Record<string, string>;
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<SettingsLoaderData> {
  const session = await requireAuth(request);
  const url = new URL(request.url);
  const success = url.searchParams.get("updated") ?? undefined;

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
    // Only the boolean crosses to the client; the ADMIN_EMAILS list stays server-side.
    isAdmin: isAdminEmail(session.user.email),
    success,
  };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<Response | SettingsActionData> {
  await requireAuth(request);
  const formData = await request.formData();
  const intent = readFormString(formData, "_intent");

  if (intent === "profile") {
    const name = readFormString(formData, "name");
    if (!name) {
      return { errors: { name: "Name is required" } };
    }
    if (name.length > 100) {
      return { errors: { name: "Name must be 100 characters or less" } };
    }
    try {
      await auth.api.updateUser({
        headers: request.headers,
        body: { name },
      });
      return redirect("/settings?updated=profile");
    } catch (error) {
      return {
        errors: {
          form: getAuthErrorMessage(error, "Failed to update profile"),
        },
      };
    }
  }

  return { errors: { form: "Unknown action" } };
}

export default function SettingsRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [, setSearchParams] = useSearchParams();

  // Stable reference so ProfileTab's auto-dismiss effect doesn't re-run on
  // every render (the previous inline closure changed identity each render,
  // repeatedly setting and clearing the timer).
  const handleDismissSuccess = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return (
    <SettingsLayout user={loaderData.user} isAdmin={loaderData.isAdmin}>
      <SettingsTabs
        user={loaderData.user}
        actionData={actionData}
        success={loaderData.success}
        onDismissSuccess={handleDismissSuccess}
      />
    </SettingsLayout>
  );
}

/**
 * Standalone chrome for the global Settings page. Settings is a top-level
 * route (reached from the user avatar menu), so it ships its own slim header
 * with the logo, top nav, theme selector, and avatar menu — no sidebar,
 * breadcrumbs, or AI chat aside.
 */
function SettingsLayout({
  user,
  isAdmin,
  children,
}: {
  user: { name: string; email: string };
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4">
          <Group gap="sm" className="min-w-0 justify-self-start">
            <UnstyledButton component={Link} to="/" aria-label="Home">
              <Text fw={700} visibleFrom="sm">
                React Router Template
              </Text>
            </UnstyledButton>
          </Group>

          <TopNav isAdmin={isAdmin} />

          <Group
            gap="sm"
            className="min-w-0 justify-self-end"
            justify="flex-end"
          >
            <ThemeSelector />
            <UserMenu user={user} />
          </Group>
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <Container size={640}>
          <Box py="md">{children}</Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
