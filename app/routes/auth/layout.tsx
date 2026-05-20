import { Box, Container, Group } from "@mantine/core";
import { Outlet } from "react-router";
import { requireAnonymous } from "~/lib/auth/require-auth.server";
import { ThemeSelector } from "~/ui/components/common/ThemeSelector";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  return null;
}

export default function AuthLayout() {
  return (
    <Box className="min-h-screen bg-[var(--mantine-color-body)]">
      <Group justify="flex-end" p="md">
        <ThemeSelector />
      </Group>
      <Container size={420} pb="xl">
        <Outlet />
      </Container>
    </Box>
  );
}
