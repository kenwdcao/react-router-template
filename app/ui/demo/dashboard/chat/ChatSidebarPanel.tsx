import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { Bot, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

interface ChatSidebarPanelProps {
  /** Closes the aside. */
  onClose: () => void;
  /** Toggles between the normal and expanded widths. */
  onToggleExpanded: () => void;
  /** Whether the aside is currently rendered at the expanded width. */
  expanded: boolean;
}

/**
 * Container rendered inside `AppShell.Aside`. Owns the panel header (title,
 * expand toggle, close button) and delegates the actual chat experience to
 * `ChatPanel`, which fills the remaining vertical space.
 */
export function ChatSidebarPanel({
  onClose,
  onToggleExpanded,
  expanded,
}: ChatSidebarPanelProps) {
  return (
    <section className="flex h-full flex-col" aria-label="AI chat panel">
      <Group justify="space-between" align="center" wrap="nowrap" mb="sm">
        <Group gap="xs" align="center">
          <Bot size={18} />
          <Text fw={600}>AI Chat</Text>
        </Group>
        <Group gap="xs" align="center" wrap="nowrap">
          <Tooltip label={expanded ? "Shrink panel" : "Expand panel"} withArrow>
            <ActionIcon
              variant="subtle"
              aria-label={expanded ? "Shrink panel" : "Expand panel"}
              onClick={onToggleExpanded}
            >
              {expanded ? (
                <PanelRightClose size={16} />
              ) : (
                <PanelRightOpen size={16} />
              )}
            </ActionIcon>
          </Tooltip>
          <ActionIcon
            variant="subtle"
            aria-label="Close AI chat"
            onClick={onClose}
          >
            <X size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <ChatPanel />
    </section>
  );
}
