import {
  AppShell,
  Avatar,
  Button,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useRouteLoaderData,
} from "react-router";
import { signOut, useSession } from "~/lib/auth/client";
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_PRIMARY_COLOR,
  buildResolvedColorSchemeCookie,
  parseColorSchemeCookie,
  parsePrimaryColorCookie,
  parseResolvedColorSchemeCookie,
} from "~/lib/utils/theme";
import { ThemeSelector } from "~/ui/components/common/ThemeSelector";
import { createAppTheme } from "~/ui/theme";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("cookie");

  return data({
    primaryColor: parsePrimaryColorCookie(cookieHeader),
    colorScheme: parseColorSchemeCookie(cookieHeader),
    resolvedColorScheme: parseResolvedColorSchemeCookie(cookieHeader),
  });
}

function ResolvedColorSchemeCookieSync() {
  const { colorScheme } = useMantineColorScheme();
  const resolvedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    const nextResolvedColorScheme =
      colorScheme === "auto" ? resolvedColorScheme : colorScheme;

    document.cookie = buildResolvedColorSchemeCookie(nextResolvedColorScheme);
  }, [colorScheme, resolvedColorScheme]);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");
  const savedPrimaryColor =
    rootLoaderData?.primaryColor ?? DEFAULT_PRIMARY_COLOR;
  const savedColorScheme = rootLoaderData?.colorScheme ?? DEFAULT_COLOR_SCHEME;
  const theme = createAppTheme(savedPrimaryColor);

  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript defaultColorScheme={savedColorScheme} />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider defaultColorScheme={savedColorScheme} theme={theme}>
          <ResolvedColorSchemeCookieSync />
          <Notifications position="top-right" />
          <AppShell header={{ height: 56 }} padding="md">
            <AppShell.Header>
              <Group h="100%" px="md" justify="space-between">
                <Text fw={600} size="lg">
                  React Router Template
                </Text>
                <Group gap="sm">
                  <ThemeSelector />
                  <AuthHeader />
                </Group>
              </Group>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AuthHeader() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (session) {
    const initial = getAvatarInitial(session.user.name, session.user.email);

    return (
      <>
        <Avatar size="sm" radius="xl">
          {initial}
        </Avatar>
        <Text size="sm" visibleFrom="sm">
          {session.user.name || session.user.email}
        </Text>
        <Button
          variant="subtle"
          size="compact-sm"
          leftSection={<LogOut size={16} />}
          aria-label="Sign out"
          onClick={async () => {
            await signOut();
            window.location.href = "/";
          }}
        >
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <Group>
      <Button variant="subtle" component="a" href="/login">
        Sign in
      </Button>
      <Button component="a" href="/register">
        Register
      </Button>
    </Group>
  );
}

function getAvatarInitial(name?: string | null, email?: string | null): string {
  const source = (name ?? "").trim() || (email ?? "").trim() || "?";
  return source.charAt(0).toUpperCase();
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
