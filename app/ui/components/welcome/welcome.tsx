import { Container, Center, Paper, Stack, Text, Anchor, Group, Image } from "@mantine/core";
import { BookOpen, MessagesSquare } from "lucide-react";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: <BookOpen size={20} />,
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: <MessagesSquare size={20} />,
  },
];

export function Welcome() {
  return (
    <Container size="xs" py="xl">
      <Center>
        <Stack align="center" gap="xl">
          <Image
            src={logoLight}
            alt="React Router"
            w={300}
            visibleFrom="xs"
            darkHidden
          />
          <Image
            src={logoDark}
            alt="React Router"
            w={300}
            visibleFrom="xs"
            lightHidden
          />
          <Paper shadow="sm" radius="md" p="lg" withBorder>
            <Stack gap="md">
              <Text ta="center" fw={500}>
                What's next?
              </Text>
              {resources.map(({ href, text, icon }) => (
                <Anchor
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                >
                  <Group gap="sm">
                    {icon}
                    <span>{text}</span>
                  </Group>
                </Anchor>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Center>
    </Container>
  );
}
