import { Anchor, Stack, Text, Title } from "@mantine/core";
import {
  AlertsDemo,
  DataDisplayDemo,
  FeedbackDemo,
  InputsDemo,
  NavigationDemo,
  OverlayDemo,
  TableDemo,
} from "~/ui/components/dashboard/components-gallery";

export function meta() {
  return [{ title: "Components" }];
}

export default function ComponentsRoute() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Components</Title>
        <Text c="dimmed">
          Mantine component gallery showcasing tables, inputs, data display,
          navigation, feedback, alerts, and overlays. Built with{" "}
          <Anchor
            href="https://mantine.dev"
            target="_blank"
            inherit
            size="sm"
          >
            Mantine v9
          </Anchor>
          .
        </Text>
      </div>

      <InputsDemo />
      <TableDemo />
      <DataDisplayDemo />
      <NavigationDemo />
      <FeedbackDemo />
      <AlertsDemo />
      <OverlayDemo />
    </Stack>
  );
}
