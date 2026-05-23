import {
  Button,
  Code,
  Container,
  CopyButton,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { Check, Copy } from "lucide-react";
import classes from "./GetStarted.module.css";

const command = "pnpm install && pnpm dev";

export function GetStarted() {
  return (
    <Container size="md">
      <Title order={2} ta="center" mb="sm">
        Get started
      </Title>
      <Text c="dimmed" ta="center" mb="lg">
        Postgres should be running (<Code>pnpm db:up</Code>). See README for
        full setup.
      </Text>
      <Paper withBorder p="md" className={classes.copyWrapper}>
        <Code block>{command}</Code>
        <CopyButton value={command}>
          {({ copied, copy }) => (
            <Button
              variant="subtle"
              size="xs"
              onClick={copy}
              className={classes.copyButton}
              aria-label="Copy command"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          )}
        </CopyButton>
      </Paper>
    </Container>
  );
}
