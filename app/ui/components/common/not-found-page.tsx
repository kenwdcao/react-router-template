import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router";
import { NotFoundIllustration } from "./not-found-illustration";
import classes from "./not-found-page.module.css";

export function NotFoundPage() {
  return (
    <main className={classes.page}>
      <Stack gap="xl" align="center" className={classes.content}>
        <NotFoundIllustration />
        <div aria-label="404" className={classes.code}>
          404
        </div>
        <Stack gap="xs" align="center" className={classes.copy}>
          <Title order={1}>Page not found</Title>
          <Text c="dimmed" size="lg">
            The page may have moved, or the link may no longer match an
            available page.
          </Text>
        </Stack>
        <Group gap="sm" justify="center" className={classes.actions}>
          <Button component={Link} to="/" leftSection={<Home size={16} />}>
            Go Home
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="light"
            leftSection={<LayoutDashboard size={16} />}
          >
            Open Dashboard
          </Button>
        </Group>
      </Stack>
    </main>
  );
}
