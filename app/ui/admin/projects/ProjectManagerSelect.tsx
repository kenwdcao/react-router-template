import {
  Avatar,
  Box,
  Button,
  Combobox,
  Group,
  InputBase,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core";
import { Check } from "lucide-react";
import { useState } from "react";
import type { ProjectManagerOption } from "~/lib/admin/types";
import { getAvatarInitial } from "~/lib/utils";

interface ProjectManagerSelectProps {
  availableManagers: ProjectManagerOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  error?: string | null;
  required?: boolean;
}

/** Searchable multi-select of candidate project managers with a summary list. */
export function ProjectManagerSelect({
  availableManagers,
  selectedIds,
  onChange,
  error,
  required,
}: ProjectManagerSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");

  const filteredManagers = availableManagers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(search.toLowerCase()) ||
      manager.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Active managers that are still in the candidate list.
  const availableById = new Map(availableManagers.map((m) => [m.id, m]));
  // Managers currently selected but no longer selectable (e.g. banned since
  // assignment). They must stay visible and removable in the UI — otherwise
  // the admin cannot unbind them, and server-side validation would reject the
  // save outright.
  const removedManagers: ProjectManagerOption[] = selectedIds
    .filter((id) => !availableById.has(id))
    .map((id) => ({ id, name: "Removed user", email: id, image: null }));
  const selectedManagers = [
    ...availableManagers.filter((m) => selectedIds.includes(m.id)),
    ...removedManagers,
  ];

  const handleSelect = (managerId: string) => {
    if (selectedIds.includes(managerId)) {
      onChange(selectedIds.filter((id) => id !== managerId));
    } else {
      onChange([...selectedIds, managerId]);
    }
    combobox.closeDropdown();
  };

  return (
    <>
      <Combobox store={combobox} onOptionSubmit={(val) => handleSelect(val)}>
        <Combobox.Target>
          <InputBase
            label="Project Manager"
            placeholder="Search users by name or email..."
            value={search}
            error={error}
            // Visual required asterisk only — do NOT set the native `required`
            // attribute. This input holds the search filter text, not the
            // selected value, so native required validation would block form
            // submission whenever the user picks a manager without typing.
            // Required-ness is enforced by the form's managerIds validator.
            withAsterisk={required}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {filteredManagers.length > 0 ? (
              filteredManagers.map((manager) => (
                <Combobox.Option
                  value={manager.id}
                  key={manager.id}
                  active={selectedIds.includes(manager.id)}
                >
                  <Group gap="sm" justify="space-between">
                    <Group gap="sm">
                      <Avatar
                        size="sm"
                        radius="xl"
                        src={manager.image ?? undefined}
                      >
                        {getAvatarInitial(manager.name, manager.email)}
                      </Avatar>
                      <Box>
                        <Text size="sm">{manager.name}</Text>
                        <Text size="xs" c="dimmed">
                          {manager.email}
                        </Text>
                      </Box>
                    </Group>
                    {selectedIds.includes(manager.id) && <Check size={16} />}
                  </Group>
                </Combobox.Option>
              ))
            ) : (
              <Combobox.Empty>No users found</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      {selectedManagers.length > 0 && (
        <Box>
          <Text size="sm" fw={500} mb="xs">
            Selected Managers
          </Text>
          <Stack gap="xs">
            {selectedManagers.map((manager) => (
              <Group key={manager.id} gap="sm">
                <Avatar size="sm" radius="xl" src={manager.image ?? undefined}>
                  {getAvatarInitial(manager.name, manager.email)}
                </Avatar>
                <Box className="flex-1">
                  <Text size="sm">{manager.name}</Text>
                  <Text size="xs" c="dimmed">
                    {manager.email}
                  </Text>
                </Box>
                <Button
                  variant="subtle"
                  size="xs"
                  color="red"
                  onClick={() => handleSelect(manager.id)}
                >
                  Remove
                </Button>
              </Group>
            ))}
          </Stack>
        </Box>
      )}
      {selectedIds.map((id) => (
        <input type="hidden" key={id} name="managerIds" value={id} />
      ))}
    </>
  );
}
