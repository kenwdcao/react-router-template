import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
  ColorSchemeScript,
  createTheme,
  Group,
  MantineProvider,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LogOut, Moon, Sun } from "lucide-react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { signOut, useSession } from "~/lib/auth/client";

import type { Route } from "./+types/root";
import "./app.css";

const theme = createTheme({
  fontFamily:
    "Inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
});

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript defaultColorScheme="light" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications position="top-right" />
          <AppShell header={{ height: 56 }} padding="md">
            <AppShell.Header>
              <Group h="100%" px="md" justify="space-between">
                <Text fw={600} size="lg">
                  React Router Template
                </Text>
                <Group gap="sm">
                  <ThemeToggle />
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

function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      onClick={() => setColorScheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
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
