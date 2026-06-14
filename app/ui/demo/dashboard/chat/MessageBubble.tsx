import { Avatar, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { Bot } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const theme = useMantineTheme();

  if (role === "user") {
    return (
      <Group justify="flex-end">
        <Paper
          bg={theme.primaryColor}
          p="sm"
          radius="lg"
          maw={{ base: "90%", sm: "75%" }}
        >
          <Text size="sm" c="white">
            {content}
          </Text>
        </Paper>
      </Group>
    );
  }

  return (
    <Group align="flex-start" gap="xs" wrap="nowrap">
      <Avatar size="sm" radius="xl" color="gray">
        <Bot size={14} />
      </Avatar>
      <Paper
        bg="var(--mantine-color-default-hover)"
        p="sm"
        radius="lg"
        maw={{ base: "90%", sm: "75%" }}
        className="min-w-0 wrap-break-word"
      >
        <Text size="sm" component="div">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </Text>
      </Paper>
    </Group>
  );
}
