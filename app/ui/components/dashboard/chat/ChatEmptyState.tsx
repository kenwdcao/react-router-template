import { Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { Sparkles } from "lucide-react";

/**
 * Welcome copy shown in the aside when the conversation is empty. The preset
 * questions themselves live in the FAQ dropdown (see ChatFaqMenu) to keep the
 * aside's fixed footprint small.
 */
export function ChatEmptyState() {
  return (
    <Center py="xl" px="sm">
      <Stack align="center" gap="md" w="100%" maw={500}>
        <ThemeIcon size={48} radius="xl" variant="light">
          <Sparkles size={24} />
        </ThemeIcon>
        <Text size="lg" fw={500} ta="center">
          Ask anything about this template
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Type a question below, or open the FAQ dropdown for common prompts.
        </Text>
      </Stack>
    </Center>
  );
}
