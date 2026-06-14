import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Indicator,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FolderOpenDot, LogOut, Users } from "lucide-react";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { signOut } from "~/lib/auth";
import { requireAdmin } from "~/lib/auth/index.server";
import { getAvatarInitial } from "~/lib/utils";
import { ThemeSelector } from "~/ui/components/common";
import type { Route } from "./+types/layout";

const adminTabs = [
  { value: "users", label: "Users", href: "/admin/users", icon: Users },
  {
    value: "projects",
    label: "Projects",
    href: "/admin/projects",
    icon: FolderOpenDot,
  },
] as const;

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAdmin(request);
  return {
    user: { email: session.user.email, name: session.user.name },
  };
}

export function meta() {
  return [{ title: "Admin" }];
}

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();

  const activeTab =
    adminTabs.find(
      (tab) =>
        location.pathname === tab.href ||
        location.pathname.startsWith(`${tab.href}/`),
    )?.value ?? "users";

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4">
          <Group gap="sm" className="min-w-0 justify-self-start">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <UnstyledButton component={Link} to="/" aria-label="Home">
              <Text fw={700} visibleFrom="sm">
                Admin
              </Text>
            </UnstyledButton>
          </Group>

          <Group gap="sm" className="justify-self-center">
            <Tabs
              value={activeTab}
              onChange={(value) => {
                const nextTab = adminTabs.find((tab) => tab.value === value);
                if (nextTab) void navigate(nextTab.href);
              }}
            >
              <Tabs.List>
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tabs.Tab
                      key={tab.value}
                      value={tab.value}
                      aria-label={tab.label}
                    >
                      <span className="mr-2 flex flex-row items-center justify-center gap-2">
                        <Icon className="size-4" /> {tab.label}
                      </span>
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>
            </Tabs>
          </Group>

          <Group
            gap="sm"
            className="min-w-0 justify-self-end"
            justify="flex-end"
          >
            <Button
              variant="subtle"
              component={Link}
              to="/demo/dashboard"
              visibleFrom="sm"
            >
              Dashboard
            </Button>
            <ThemeSelector />
            <Indicator
              processing
              size={8}
              offset={4}
              color="green"
              position="bottom-end"
            >
              <Avatar size="sm" radius="xl">
                {getAvatarInitial(user.name, user.email)}
              </Avatar>
            </Indicator>
            <Text size="sm" visibleFrom="md">
              {user.name || user.email}
            </Text>
            <ActionIcon
              variant="subtle"
              size="sm"
              hiddenFrom="sm"
              aria-label="Sign out"
              onClick={async () => {
                await signOut();
                void navigate("/");
              }}
            >
              <LogOut size={16} />
            </ActionIcon>
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<LogOut size={16} />}
              visibleFrom="sm"
              onClick={async () => {
                await signOut();
                void navigate("/");
              }}
            >
              Sign out
            </Button>
          </Group>
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl" className="mx-auto w-full px-0">
          <div className="pt-4">
            <Outlet />
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
