import { darkTheme, lightTheme } from "../theme";
import { useColorScheme } from "./use-color-scheme";
import type { Theme } from "../theme/theme.types";

/**
 * Returns the fully resolved Theme object for the active color scheme.
 *
 * Usage:
 *   const theme = useTheme();
 *   <View style={{ backgroundColor: theme.colors.surface.primary }} />
 *   <Text style={{ ...theme.typography.body, color: theme.colors.text.primary }} />
 *
 * This is the ONLY hook components should use to access design tokens.
 * Direct imports of lightTheme / darkTheme in components are an anti-pattern —
 * they bypass the color scheme resolution and break dark mode.
 */
export function useTheme(): Theme {
    const colorScheme = useColorScheme();

    return colorScheme === "dark" ? darkTheme : lightTheme;
}
