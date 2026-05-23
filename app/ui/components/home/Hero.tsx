import {
  Button,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { LayoutDashboard, Rocket } from "lucide-react";
import { Link } from "react-router";
import classes from "./Hero.module.css";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Hero() {
  return (
    <div className={classes.backdrop}>
      <Container size="lg" py="xl">
        <Stack align="center" gap="lg">
          <Image
            src={logoLight}
            alt="React Router"
            w={200}
            visibleFrom="xs"
            darkHidden
          />
          <Image
            src={logoDark}
            alt="React Router"
            w={200}
            visibleFrom="xs"
            lightHidden
          />
          <Title order={1} className={classes.gradientTitle}>
            React Router Template
          </Title>
          <Text size="xl" c="dimmed" ta="center" maw={620}>
            A batteries-included full-stack starter with authentication,
            database, SSR, testing, and a polished UI out of the box.
          </Text>
          <Group grow>
            <Button
              size="lg"
              component={Link}
              to="/dashboard"
              leftSection={<LayoutDashboard size={18} />}
            >
              View Dashboard Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              component={Link}
              to="/register"
              leftSection={<Rocket size={18} />}
            >
              Get Started
            </Button>
          </Group>
        </Stack>
      </Container>
    </div>
  );
}
