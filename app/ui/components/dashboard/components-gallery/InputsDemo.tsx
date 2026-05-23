import {
  Checkbox,
  Chip,
  Group,
  Paper,
  PasswordInput,
  Radio,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useState } from "react";

const selectData = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

export function InputsDemo() {
  const [sliderValue, setSliderValue] = useState(40);
  const [segmentedValue, setSegmentedValue] = useState("react");

  return (
    <Paper withBorder p="md" radius="sm">
      <Title order={3} mb="md">
        Inputs & Forms
      </Title>

      <Stack gap="md">
        <Group grow>
          <TextInput
            label="Text Input"
            placeholder="Enter some text..."
            description="Standard text input field"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password..."
            description="Hidden input for secrets"
          />
        </Group>

        <Textarea
          label="Textarea"
          placeholder="Write something here..."
          autosize
          minRows={2}
          maxRows={4}
          description="Auto-resizing multiline input"
        />

        <Group grow>
          <Select
            label="Select"
            placeholder="Pick a framework"
            data={selectData}
            description="Single selection dropdown"
          />
          <Select
            label="Multi Select"
            placeholder="Pick frameworks"
            data={selectData}
            multiple
            searchable
            description="Multi-selection with search"
          />
        </Group>

        <Group>
          <Checkbox label="Accept terms" defaultChecked />
          <Checkbox label="Newsletter" />
        </Group>

        <Radio.Group name="framework" label="Radio Group" defaultValue="react">
          <Group mt="xs">
            <Radio value="react" label="React" />
            <Radio value="vue" label="Vue" />
            <Radio value="svelte" label="Svelte" />
          </Group>
        </Radio.Group>

        <Group>
          <Switch label="Dark mode" />
          <Switch label="Notifications" defaultChecked />
        </Group>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Slider — {sliderValue}%
          </Text>
          <Slider
            aria-label="Slider value"
            value={sliderValue}
            onChange={setSliderValue}
            marks={[
              { value: 0, label: "0%" },
              { value: 50, label: "50%" },
              { value: 100, label: "100%" },
            ]}
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Segmented Control
          </Text>
          <SegmentedControl
            value={segmentedValue}
            onChange={setSegmentedValue}
            data={selectData}
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Chips
          </Text>
          <Chip.Group>
            <Group gap="xs">
              <Chip defaultChecked>React</Chip>
              <Chip>Vue</Chip>
              <Chip>Angular</Chip>
              <Chip>Svelte</Chip>
            </Group>
          </Chip.Group>
        </div>
      </Stack>
    </Paper>
  );
}
