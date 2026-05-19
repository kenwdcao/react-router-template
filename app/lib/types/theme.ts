import type { MantineColorScheme } from "@mantine/core";

export type ColorScheme = MantineColorScheme;
export type ResolvedColorScheme = Exclude<MantineColorScheme, "auto">;
export type PrimaryColor = "blue" | "teal" | "pink" | "violet";
