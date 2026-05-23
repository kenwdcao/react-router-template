import { Badge, Container, Group, Title } from "@mantine/core";

// Keep in sync with package.json
const deps = [
  "React 19",
  "React Router 7.15",
  "Mantine 9.2",
  "Tailwind 4.2",
  "Prisma 7",
  "Kysely 0.29",
  "better-auth 1.6",
  "Vitest 4",
  "Playwright 1.60",
  "TypeScript 5.9",
];

export function TechStack() {
  return (
    <Container size="lg">
      <Title order={2} ta="center" mb="lg">
        Tech Stack
      </Title>
      <Group justify="center" gap="xs">
        {deps.map((dep) => (
          <Badge key={dep} variant="light" size="lg">
            {dep}
          </Badge>
        ))}
      </Group>
    </Container>
  );
}
