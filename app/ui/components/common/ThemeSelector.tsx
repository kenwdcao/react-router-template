import {
  Box,
  Button,
  Divider,
  Menu,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useCallback } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import type { ColorScheme, PrimaryColor } from "~/lib/types";
import {
  buildColorSchemeCookie,
  buildPrimaryColorCookie,
  buildResolvedColorSchemeCookie,
  DEFAULT_PRIMARY_COLOR,
  PRIMARY_COLOR_LABELS,
  PRIMARY_COLOR_VALUES,
} from "~/lib/utils";
import type { loader } from "~/root";
import classes from "./ThemeSelector.module.css";

interface ThemeSelectorProps {
  dropdownPosition?: "bottom" | "top" | "left" | "right";
  initialPrimaryColor?: PrimaryColor;
}

const colorSchemes: {
  value: ColorScheme;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "light", label: "Light", icon: <Sun size={16} /> },
  { value: "dark", label: "Dark", icon: <Moon size={16} /> },
  { value: "auto", label: "System", icon: <Monitor size={16} /> },
];

export function ThemeSelector({
  dropdownPosition = "bottom",
  initialPrimaryColor = DEFAULT_PRIMARY_COLOR,
}: ThemeSelectorProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { revalidate } = useRevalidator();
  const mantineTheme = useMantineTheme();
  const rootLoaderData = useRouteLoaderData<typeof loader>("root");

  const currentPrimaryColor =
    rootLoaderData?.primaryColor ?? initialPrimaryColor;

  const handleColorSchemeChange = useCallback(
    (scheme: ColorScheme) => {
      setColorScheme(scheme);
      document.cookie = buildColorSchemeCookie(scheme);
      document.cookie = buildResolvedColorSchemeCookie(
        scheme === "auto" ? computedColorScheme : scheme,
      );
      void revalidate();
    },
    [setColorScheme, computedColorScheme, revalidate],
  );

  const handlePrimaryColorChange = useCallback(
    (color: PrimaryColor) => {
      if (color === currentPrimaryColor) {
        return;
      }

      document.cookie = buildPrimaryColorCookie(color);
      void revalidate();
    },
    [currentPrimaryColor, revalidate],
  );

  const positionMap = {
    bottom: "bottom" as const,
    top: "top" as const,
    left: "left" as const,
    right: "right" as const,
  };

  return (
    <Menu position={positionMap[dropdownPosition]} withinPortal>
      <Menu.Target>
        <Button variant="subtle" size="sm" p={4} aria-label="Open theme menu">
          <Palette size={20} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {/* Color Scheme Section */}
        <Menu.Label>Mode</Menu.Label>
        {colorSchemes.map((scheme) => {
          const isActive = colorScheme === scheme.value;
          return (
            <Menu.Item
              key={scheme.value}
              leftSection={scheme.icon}
              rightSection={isActive ? <Check size={16} /> : null}
              onClick={() => handleColorSchemeChange(scheme.value)}
              bg={isActive ? "var(--mantine-primary-color-light)" : undefined}
            >
              <Text size="sm">{scheme.label}</Text>
            </Menu.Item>
          );
        })}

        <Divider my="xs" />

        {/* Primary Color Section */}
        <Menu.Label>Theme</Menu.Label>
        {PRIMARY_COLOR_VALUES.map((colorValue) => {
          const isActive = currentPrimaryColor === colorValue;
          const swatchColor = mantineTheme.colors[colorValue]?.[6] ?? "#228be6";
          return (
            <Menu.Item
              key={colorValue}
              leftSection={
                <Box
                  className={classes.colorSwatch}
                  data-active={isActive}
                  bg={swatchColor}
                />
              }
              rightSection={isActive ? <Check size={16} /> : null}
              onClick={() => handlePrimaryColorChange(colorValue)}
              bg={isActive ? "var(--mantine-primary-color-light)" : undefined}
            >
              <Text size="sm">{PRIMARY_COLOR_LABELS[colorValue]}</Text>
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
