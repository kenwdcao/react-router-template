import { Combobox, InputBase, useCombobox } from "@mantine/core";
import { useState } from "react";

interface ClientComboboxProps {
  clients: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
}

/** Free-text client input with a dropdown of previously used client names. */
export function ClientCombobox({
  clients,
  value,
  onChange,
  required,
  error,
}: ClientComboboxProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) =>
    client.toLowerCase().includes(search.toLowerCase()),
  );

  const options = filteredClients.map((client) => (
    <Combobox.Option value={client} key={client}>
      {client}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
        setSearch(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label="Client"
          placeholder="Select or type client..."
          value={search || value}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            onChange(e.currentTarget.value);
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          required={required}
          error={error}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>No clients found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
      <input type="hidden" name="client" value={value} />
    </Combobox>
  );
}
