import { Button, Menu } from "@mantine/core";
import { ChevronDown, ListChecks } from "lucide-react";
import { suggestedPrompts } from "./suggested-prompts";

interface ChatFaqMenuProps {
  /** Called with the chosen prompt when a FAQ item is clicked. */
  onSendPrompt: (prompt: string) => void;
  /** Disable the trigger while a request is in flight. */
  disabled?: boolean;
}

/**
 * Collapsible FAQ dropdown for the preset questions. Renders a single "FAQ"
 * button that expands into a menu of suggested prompts, so the questions take
 * up zero fixed vertical space inside the aside until the user wants them.
 */
export function ChatFaqMenu({ onSendPrompt, disabled }: ChatFaqMenuProps) {
  if (suggestedPrompts.length === 0) {
    return null;
  }

  return (
    <Menu shadow="md" width={300} position="bottom-start" withinPortal>
      <Menu.Target>
        <Button
          variant="light"
          size="compact-sm"
          leftSection={<ListChecks size={15} />}
          rightSection={<ChevronDown size={14} />}
          disabled={disabled}
          aria-label="Frequently asked questions"
        >
          FAQ
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {suggestedPrompts.map((prompt) => (
          <Menu.Item key={prompt} onClick={() => onSendPrompt(prompt)}>
            {prompt}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
