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
      <Container size="lg" py={{ base: "md", sm: "xl" }}>
        <Stack align="center" gap="md">
          <Image
            src={logoLight}
            alt="React Router"
            w={160}
            visibleFrom="sm"
            darkHidden
          />
          <Image
            src={logoDark}
            alt="React Router"
            w={160}
            visibleFrom="sm"
            lightHidden
          />
          <Title order={1} className={classes.gradientTitle} ta="center">
            React Router Template
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={620}>
            A batteries-included full-stack starter with authentication,
            database, SSR, testing, and a polished UI out of the box.
          </Text>
          <Group w="100%" maw={580} visibleFrom="sm" grow aria-hidden="true">
            <Button
              size="lg"
              component={Link}
              to="/demo/dashboard"
              leftSection={<LayoutDashboard size={18} />}
              tabIndex={-1}
            >
              View Dashboard Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              component={Link}
              to="/register"
              leftSection={<Rocket size={18} />}
              tabIndex={-1}
            >
              Get Started
            </Button>
          </Group>
          <Stack w="100%" hiddenFrom="sm" gap="sm">
            <Button
              size="md"
              fullWidth
              component={Link}
              to="/demo/dashboard"
              leftSection={<LayoutDashboard size={18} />}
              styles={{ label: { whiteSpace: "normal" } }}
            >
              View Dashboard Demo
            </Button>
            <Button
              size="md"
              variant="outline"
              fullWidth
              component={Link}
              to="/register"
              leftSection={<Rocket size={18} />}
            >
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
