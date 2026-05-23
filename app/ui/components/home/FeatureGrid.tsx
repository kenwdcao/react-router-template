import {
  Card,
  Container,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  Database,
  FlaskConical,
  Palette,
  Route,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Authentication",
    description:
      "better-auth with email/password, session management, and protected routes.",
  },
  {
    icon: <Database size={20} />,
    title: "Database",
    description: "PostgreSQL with Prisma ORM and Kysely query builder.",
  },
  {
    icon: <Route size={20} />,
    title: "Routing & SSR",
    description:
      "React Router v7 with server-side rendering and file-based routing.",
  },
  {
    icon: <Palette size={20} />,
    title: "UI System",
    description: "Mantine v9 components plus Tailwind v4 for utility styling.",
  },
  {
    icon: <FlaskConical size={20} />,
    title: "Testing",
    description: "Vitest for unit tests and Playwright for end-to-end tests.",
  },
  {
    icon: <Wrench size={20} />,
    title: "DX",
    description:
      "TypeScript, ESLint, Prettier, and Husky for a smooth workflow.",
  },
];

export function FeatureGrid() {
  return (
    <Container size="lg">
      <Title order={2} ta="center" mb="xl">
        What&apos;s included
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {features.map((feature) => (
          <Card key={feature.title} withBorder radius="md" padding="lg">
            <ThemeIcon size="lg" variant="light" mb="sm">
              {feature.icon}
            </ThemeIcon>
            <Text fw={600} mb={4}>
              {feature.title}
            </Text>
            <Text c="dimmed" size="sm">
              {feature.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
