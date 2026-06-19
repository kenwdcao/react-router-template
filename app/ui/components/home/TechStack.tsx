import { Badge, Container, Group, Title } from "@mantine/core";

// Keep in sync with package.json
const deps = [
  "React 19",
  "React Router v8",
  "Mantine 9.3",
  "Tailwind 4.3",
  "Prisma 7",
  "Kysely 0.29",
  "better-auth 1.6",
  "Vitest 4",
  "Playwright 1.60",
  "TypeScript 6.0",
];

export function TechStack() {
  return (
    <Container size="lg">
      <Title order={2} ta="center" mb="lg">
        Tech Stack
      </Title>
      <Group justify="center" gap="xs" wrap="wrap">
        {deps.map((dep) => (
          <Badge key={dep} variant="light" size="lg">
            {dep}
          </Badge>
        ))}
      </Group>
    </Container>
  );
}
