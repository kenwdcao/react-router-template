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
    <Center py="xl">
      <Stack align="center" gap="md">
        <ThemeIcon size={48} radius="xl" variant="light">
          <Sparkles size={24} />
        </ThemeIcon>
        <Text size="lg" fw={500}>
          Ask anything about this template
        </Text>
        <Stack gap="xs">
          {suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="light"
              fullWidth
              onClick={() => onSendPrompt(prompt)}
              aria-label={`Ask: ${prompt}`}
            >
              {prompt}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Center>
  );
}
