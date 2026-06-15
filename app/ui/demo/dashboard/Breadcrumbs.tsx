import { Breadcrumbs as MantineBreadcrumbs, Text } from "@mantine/core";
import { Link, useLocation } from "react-router";

// /demo/dashboard is the section root — it has no index route of its own under
// /demo (only /demo/dashboard is registered in routes.ts), so the intermediate
// /demo segment must not become a breadcrumb (it would link to a dead route).
const ROOT_PATH = "/demo/dashboard";

const routeLabels: Record<string, string> = {
  [ROOT_PATH]: "Dashboard",
  "/demo/dashboard/projects": "Projects",
  "/demo/dashboard/activity": "Activity",
  "/demo/dashboard/components": "Components",
};

interface BreadcrumbSegment {
  path: string;
  label: string;
}

function buildSegments(pathname: string): BreadcrumbSegment[] {
  // Only build breadcrumbs inside the dashboard section.
  if (!pathname.startsWith(`${ROOT_PATH}/`) && pathname !== ROOT_PATH) {
    return [];
  }

  // Treat /demo/dashboard as the root segment so the namespace prefix /demo is
  // never rendered as an intermediate (dead) crumb.
  const tail = pathname.slice(ROOT_PATH.length); // "" | "/projects" | ...
  const parts = tail.split("/").filter(Boolean);

  const segments: BreadcrumbSegment[] = [
    { path: ROOT_PATH, label: routeLabels[ROOT_PATH] ?? "Dashboard" },
  ];

  let current = ROOT_PATH;
  for (const part of parts) {
    current += `/${part}`;
    const label = routeLabels[current] ?? part;
    segments.push({ path: current, label });
  }

  return segments;
}

export function Breadcrumbs() {
  const location = useLocation();
  const segments = buildSegments(location.pathname);

  if (segments.length <= 1) {
    return null;
  }

  const items = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;

    if (isLast) {
      return (
        <Text key={segment.path} size="sm" truncate>
          {segment.label}
        </Text>
      );
    }

    return (
      <Text
        key={segment.path}
        component={Link}
        to={segment.path}
        c="dimmed"
        size="sm"
        truncate
      >
        {segment.label}
      </Text>
    );
  });

  return (
    <MantineBreadcrumbs
      separatorMargin={4}
      styles={{
        root: {
          overflowX: "auto",
          flexWrap: "nowrap",
        },
        separator: {
          margin: "0 2px",
        },
      }}
    >
      {items}
    </MantineBreadcrumbs>
  );
}
