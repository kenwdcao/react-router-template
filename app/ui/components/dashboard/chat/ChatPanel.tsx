import { useChat } from "@ai-sdk/react";
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { AlertCircle, RefreshCw, Send, Trash2 } from "lucide-react";
import { ChatEmptyState } from "./ChatEmptyState";
import { MessageBubble } from "./MessageBubble";

function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

function ChatInputBar({
  isLoading,
  onClear,
  onSubmit,
  showClear,
}: {
  isLoading: boolean;
  onClear: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showClear: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <Paper withBorder p="sm" radius="sm">
        <Group align="flex-end" gap="xs">
          <Textarea
            name="prompt"
            placeholder="Ask about this template..."
            aria-label="Chat message"
            autosize
            minRows={1}
            maxRows={4}
            flex={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = (e.target as HTMLTextAreaElement).closest("form");
                if (form) form.requestSubmit();
              }
            }}
          />
          <ActionIcon
            size="lg"
            variant="light"
            type="submit"
            loading={isLoading}
            aria-label="Send message"
          >
            <Send size={16} />
          </ActionIcon>
          {showClear && (
            <ActionIcon
              size="lg"
              variant="subtle"
              color="red"
              onClick={onClear}
              aria-label="Clear chat"
            >
              <Trash2 size={16} />
            </ActionIcon>
          )}
        </Group>
      </Paper>
    </form>
  );
}

export function ChatPanel() {
  const { messages, sendMessage, status, setMessages, error, regenerate } =
    useChat({
      id: "dashboard-chat",
    });
  const isLoading = status === "streaming";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;
    if (!prompt?.trim()) return;
    sendMessage({ text: prompt });
    (e.target as HTMLFormElement).reset();
  }

  function handleClear() {
    setMessages([]);
  }

  function handleSendPrompt(prompt: string) {
    sendMessage({ text: prompt });
  }

  if (messages.length === 0) {
    return (
      <Stack gap="md" h="calc(100vh - 200px)">
        <Center flex={1}>
          <ChatEmptyState onSendPrompt={handleSendPrompt} />
        </Center>
        <Stack gap="xs">
          {error && (
            <Alert
              color="red"
              icon={<AlertCircle size={16} />}
              withCloseButton
              onClose={() => setMessages([])}
            >
              <Group gap="xs" align="center">
                <Text size="sm">Failed to get a response.</Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<RefreshCw size={12} />}
                  onClick={() => regenerate()}
                >
                  Retry
                </Button>
              </Group>
            </Alert>
          )}
          <ChatInputBar
            isLoading={isLoading}
            onClear={handleClear}
            onSubmit={handleSubmit}
            showClear={false}
          />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="md" h="calc(100vh - 200px)">
      <ScrollArea flex={1}>
        <Stack gap="sm">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageText(message.parts)}
            />
          ))}
          {isLoading && (
            <Group gap="xs">
              <Loader size="xs" />
            </Group>
          )}
          {error && (
            <Alert
              color="red"
              icon={<AlertCircle size={16} />}
              withCloseButton
              onClose={() => setMessages([])}
            >
              <Group gap="xs" align="center">
                <Text size="sm">Failed to get a response.</Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<RefreshCw size={12} />}
                  onClick={() => regenerate()}
                >
                  Retry
                </Button>
              </Group>
            </Alert>
          )}
        </Stack>
      </ScrollArea>

      <ChatInputBar
        isLoading={isLoading}
        onClear={handleClear}
        onSubmit={handleSubmit}
        showClear={messages.length > 0}
      />
    </Stack>
  );
}
