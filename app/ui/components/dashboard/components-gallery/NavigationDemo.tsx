import {
  Anchor,
  Breadcrumbs,
  Group,
  NavLink,
  Paper,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router";
import { CheckSquare, Database, User } from "lucide-react";

const breadcrumbItems = [
  { title: "Home", to: "/" },
  { title: "Dashboard", to: "/dashboard" },
  { title: "Components", to: "/dashboard/components" },
];

export function NavigationDemo() {
  const [active, setActive] = useState(1);
  const [navActive, setNavActive] = useState(0);

  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Navigation
      </Title>

      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Breadcrumbs
          </Text>
          <Breadcrumbs separator="/" separatorMargin="xs">
            {breadcrumbItems.map((item) => (
              <Anchor
                key={item.title}
                component={Link}
                to={item.to}
                size="sm"
                aria-label={item.title}
              >
                {item.title}
              </Anchor>
            ))}
          </Breadcrumbs>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Stepper
          </Text>
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              label="Account"
              description="Create an account"
              icon={<User size={18} />}
            >
              <Text size="sm" c="dimmed" py="sm">
                Fill in your account details to get started.
              </Text>
            </Stepper.Step>
            <Stepper.Step
              label="Database"
              description="Configure database"
              icon={<Database size={18} />}
            >
              <Text size="sm" c="dimmed" py="sm">
                Set up your PostgreSQL connection and run migrations.
              </Text>
            </Stepper.Step>
            <Stepper.Step
              label="Complete"
              description="Finish setup"
              icon={<CheckSquare size={18} />}
            >
              <Text size="sm" c="dimmed" py="sm">
                Review your configuration and start building.
              </Text>
            </Stepper.Step>
          </Stepper>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Nav Links
          </Text>
          <Paper withBorder maw={280}>
            <NavLink
              label="Dashboard"
              active={navActive === 0}
              onClick={() => setNavActive(0)}
            />
            <NavLink
              label="Projects"
              active={navActive === 1}
              onClick={() => setNavActive(1)}
            />
            <NavLink
              label="Settings"
              active={navActive === 2}
              onClick={() => setNavActive(2)}
            />
          </Paper>
        </div>

        <Group>
          <Anchor href="https://mantine.dev" target="_blank" size="sm">
            Mantine docs
          </Anchor>
          <Anchor href="https://reactrouter.com" target="_blank" size="sm">
            React Router docs
          </Anchor>
          <Anchor
            href="https://github.com/kenwdcao/react-router-template"
            target="_blank"
            size="sm"
          >
            Template repo
          </Anchor>
        </Group>
      </Stack>
    </Paper>
  );
}
