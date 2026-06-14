import { Breadcrumbs as MantineBreadcrumbs, Text } from "@mantine/core";
import { Link, useLocation } from "react-router";

const routeLabels: Record<string, string> = {
  "/demo/dashboard": "Dashboard",
  "/demo/dashboard/projects": "Projects",
  "/demo/dashboard/activity": "Activity",
  "/demo/dashboard/settings": "Settings",
  "/demo/dashboard/components": "Components",
};

interface BreadcrumbSegment {
  path: string;
  label: string;
}

function buildSegments(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  const parts = pathname.split("/").filter(Boolean);

  let current = "";
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
