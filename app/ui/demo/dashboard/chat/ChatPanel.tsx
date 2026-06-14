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
import { useState } from "react";
import { readFormString } from "~/lib/utils";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatFaqMenu } from "./ChatFaqMenu";
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
      <Paper withBorder p={{ base: "xs", sm: "sm" }} radius="sm">
        <Group align="flex-end" gap="xs" wrap="nowrap">
          <Textarea
            name="prompt"
            placeholder="Ask about this template..."
            aria-label="Chat message"
            autosize
            minRows={1}
            maxRows={4}
            className="min-w-0 flex-1"
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
          {showClear ? (
            <ActionIcon
              size="lg"
              variant="subtle"
              color="red"
              onClick={onClear}
              aria-label="Clear chat"
            >
              <Trash2 size={16} />
            </ActionIcon>
          ) : null}
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
  // Track error visibility locally so dismissing an error Alert only hides it
  // instead of wiping the whole conversation (the previous onClose cleared all
  // messages). Reset whenever a new prompt is sent or a response is retried so
  // a fresh error can surface again.
  const [errorDismissed, setErrorDismissed] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = readFormString(formData, "prompt");
    if (!prompt) return;
    setErrorDismissed(false);
    void sendMessage({ text: prompt });
    (e.target as HTMLFormElement).reset();
  }

  function handleClear() {
    setMessages([]);
  }

  function handleSendPrompt(prompt: string) {
    setErrorDismissed(false);
    void sendMessage({ text: prompt });
  }

  function handleRetry() {
    setErrorDismissed(false);
    void regenerate();
  }

  const showError = Boolean(error) && !errorDismissed;

  if (messages.length === 0) {
    return (
      <Stack gap="md" className="min-h-0 flex-1">
        <Center flex={1}>
          <ChatEmptyState />
        </Center>
        <Stack gap="xs">
          {showError ? (
            <Alert
              color="red"
              icon={<AlertCircle size={16} />}
              withCloseButton
              onClose={() => setErrorDismissed(true)}
            >
              <Group gap="xs" align="center">
                <Text size="sm">Failed to get a response.</Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<RefreshCw size={12} />}
                  onClick={handleRetry}
                >
                  Retry
                </Button>
              </Group>
            </Alert>
          ) : null}
          <ChatFaqMenu onSendPrompt={handleSendPrompt} disabled={isLoading} />
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
    <Stack gap="md" className="min-h-0 flex-1">
      <ScrollArea flex={1}>
        <Stack gap="sm">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={getMessageText(message.parts)}
            />
          ))}
          {isLoading ? (
            <Group gap="xs">
              <Loader size="xs" />
            </Group>
          ) : null}
          {showError ? (
            <Alert
              color="red"
              icon={<AlertCircle size={16} />}
              withCloseButton
              onClose={() => setErrorDismissed(true)}
            >
              <Group gap="xs" align="center">
                <Text size="sm">Failed to get a response.</Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<RefreshCw size={12} />}
                  onClick={handleRetry}
                >
                  Retry
                </Button>
              </Group>
            </Alert>
          ) : null}
        </Stack>
      </ScrollArea>

      <ChatFaqMenu onSendPrompt={handleSendPrompt} disabled={isLoading} />
      <ChatInputBar
        isLoading={isLoading}
        onClear={handleClear}
        onSubmit={handleSubmit}
        showClear={messages.length > 0}
      />
    </Stack>
  );
}
