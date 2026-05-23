import { Button, Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { Sparkles } from "lucide-react";

interface ChatEmptyStateProps {
  onSendPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  "What's in this template?",
  "How do I add a new route?",
  "How is auth set up?",
  "How do I create a new project using this template?",
  "How do I migrate my existing React Router v7 app to this template?",
];

export function ChatEmptyState({ onSendPrompt }: ChatEmptyStateProps) {
  return (
    <Center py="xl" px="sm">
      <Stack align="center" gap="md" w="100%" maw={500}>
        <ThemeIcon size={48} radius="xl" variant="light">
          <Sparkles size={24} />
        </ThemeIcon>
        <Text size="lg" fw={500} ta="center">
          Ask anything about this template
        </Text>
        <Stack gap="xs" w="100%">
          {suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="light"
              fullWidth
              size="sm"
              onClick={() => onSendPrompt(prompt)}
              aria-label={`Ask: ${prompt}`}
              styles={{
                inner: {
                  justifyContent: "flex-start",
                },
                label: {
                  whiteSpace: "normal",
                  textAlign: "left",
                  lineHeight: 1.3,
                },
              }}
            >
              {prompt}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Center>
  );
}
