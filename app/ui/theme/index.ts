import { createTheme } from "@mantine/core";
import type { PrimaryColor } from "~/lib/types/theme";

export function createAppTheme(primaryColor: PrimaryColor) {
  return createTheme({
    primaryColor,
    defaultRadius: "md",
  });
}
