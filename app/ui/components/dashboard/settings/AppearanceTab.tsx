import {
  Box,
  Group,
  SegmentedControl,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useCallback } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import type { PrimaryColor } from "~/lib/types";
import {
  PRIMARY_COLOR_LABELS,
  PRIMARY_COLOR_VALUES,
  buildColorSchemeCookie,
  buildPrimaryColorCookie,
  buildResolvedColorSchemeCookie,
  isColorScheme,
} from "~/lib/utils";
import type { loader } from "~/root";
import classes from "./AppearanceTab.module.css";

export function AppearanceTab() {
  const { setColorScheme, colorScheme: currentScheme } =
    useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { revalidate } = useRevalidator();
  const mantineTheme = useMantineTheme();
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");
  const currentPrimaryColor = rootLoaderData?.primaryColor ?? "blue";

  const handleColorSchemeChange = useCallback(
    (value: string) => {
      if (!isColorScheme(value)) return;
      setColorScheme(value);
      document.cookie = buildColorSchemeCookie(value);
      document.cookie = buildResolvedColorSchemeCookie(
        value === "auto" ? computedColorScheme : value,
      );
      void revalidate();
    },
    [setColorScheme, computedColorScheme, revalidate],
  );

  const handlePrimaryColorChange = useCallback(
    (color: PrimaryColor) => {
      if (color === currentPrimaryColor) return;
      document.cookie = buildPrimaryColorCookie(color);
      void revalidate();
    },
    [currentPrimaryColor, revalidate],
  );

  return (
    <Stack gap="md" maw={480}>
      <Text size="xs" c="dimmed">
        Changes are saved automatically.
      </Text>

      <div>
        <Text size="sm" fw={500} mb="xs">
          Color scheme
        </Text>
        <SegmentedControl
          data={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ]}
          value={currentScheme}
          onChange={handleColorSchemeChange}
        />
      </div>

      <div>
        <Text size="sm" fw={500} mb="xs">
          Primary color
        </Text>
        <Group gap="xs">
          {PRIMARY_COLOR_VALUES.map((color) => {
            const swatchColor = mantineTheme.colors[color]?.[6] ?? color;
            const isActive = currentPrimaryColor === color;

            return (
              <button
                key={color}
                type="button"
                className={classes.swatch}
                title={PRIMARY_COLOR_LABELS[color]}
                aria-label={`Select ${PRIMARY_COLOR_LABELS[color]} color`}
                data-active={isActive}
                onClick={() => handlePrimaryColorChange(color)}
              >
                <Box
                  className={classes.swatchInner}
                  bg={swatchColor}
                  data-active={isActive}
                />
              </button>
            );
          })}
        </Group>
      </div>
    </Stack>
  );
}
