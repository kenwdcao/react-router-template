import {
  Center,
  ColorSchemeScript,
  Loader,
  MantineProvider,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Suspense, useEffect } from "react";
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
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_PRIMARY_COLOR,
  buildResolvedColorSchemeCookie,
  parseColorSchemeCookie,
  parsePrimaryColorCookie,
  parseResolvedColorSchemeCookie,
} from "~/lib/utils";
import { RouteProgress } from "~/ui/components/common";
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
  const savedResolvedColorScheme =
    rootLoaderData?.resolvedColorScheme ?? "light";
  const theme = createAppTheme(savedPrimaryColor);

  return (
    <html lang="en" data-mantine-color-scheme={savedResolvedColorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript defaultColorScheme={savedColorScheme} />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider defaultColorScheme={savedColorScheme} theme={theme}>
          <ModalsProvider>
            <ResolvedColorSchemeCookieSync />
            <Notifications position="top-right" />
            <RouteProgress />
            <Suspense fallback={<PageFallback />}>{children}</Suspense>
          </ModalsProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function PageFallback() {
  return (
    <Center mih="100vh">
      <Loader aria-label="Loading page" />
    </Center>
  );
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
