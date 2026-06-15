import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
  opened: boolean;
  /** Called when the user chooses to keep editing ("Keep Editing" button / modal backdrop). */
  onClose: () => void;
  /** Called when the user confirms they want to discard changes. */
  onConfirm: () => void;
}

export function UnsavedChangesModal({
  opened,
  onClose,
  onConfirm,
}: UnsavedChangesModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      withCloseButton={false}
      title={<Text fw={700}>Unsaved Changes</Text>}
    >
      <Stack gap="md">
        <Alert
          icon={<AlertTriangle size={18} />}
          color="orange"
          variant="light"
        >
          You have unsaved changes. Discard them and close?
        </Alert>
        <Group gap="sm" justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Keep Editing
          </Button>
          <Button
            color="red"
            leftSection={<AlertTriangle size={16} />}
            onClick={onConfirm}
          >
            Discard Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
