import type { radii } from "../tokens/radii";
import type { shadows } from "../tokens/shadows";
import type { spacing } from "../tokens/spacing";
import type { fontFamilies, typographyVariants } from "../tokens/typography";

/**
 * Theme
 *
 * The contract every theme object (light, dark) must satisfy.
 * Components never reference raw token values — they reference theme keys.
 *
 * Structure mirrors semanticColors but is resolved to flat string values,
 * making it safe to spread directly into StyleSheet without nested lookups.
 */

// ─── Color sub-types ─────────────────────────────────────────────────────────

export interface ThemeBrandColors {
    default: string;
    subtle: string;
    strong: string;
}

export interface ThemeStatusColors {
    income: string;
    incomeSubtle: string;
    incomeBorder: string;
    expense: string;
    expenseSubtle: string;
    expenseBorder: string;
    danger: string;
    dangerSubtle: string;
    success: string;
    error: string;
}

export interface ThemeTextColors {
    primary: string;
    muted: string;
    subtle: string;
    inverse: string;
    link: string;
    placeholder: string;
}

export interface ThemeSurfaceColors {
    primary: string;
    subtle: string;
    muted: string;
    overlay: string;
}

export interface ThemeBorderColors {
    default: string;
    muted: string;
    brandSubtle: string;
}

export interface ThemeIconColors {
    default: string;
    brand: string;
    close: string;
}

export interface ThemeInteractiveVariant {
    background: string;
    text: string;
    backgroundPressed?: string;
}

export interface ThemeInteractiveColors {
    primary: ThemeInteractiveVariant;
    destructive: ThemeInteractiveVariant;
    ghost: ThemeInteractiveVariant & { border: string };
}

export interface ThemeTabColors {
    iconDefault: string;
    iconSelected: string;
}

export interface ThemeColors {
    brand: ThemeBrandColors;
    status: ThemeStatusColors;
    text: ThemeTextColors;
    surface: ThemeSurfaceColors;
    border: ThemeBorderColors;
    icon: ThemeIconColors;
    interactive: ThemeInteractiveColors;
    tab: ThemeTabColors;
}

// ─── Full Theme type ──────────────────────────────────────────────────────────

export interface Theme {
    colorScheme: "light" | "dark";
    colors: ThemeColors;

    /**
     * Typography variants — same shape as `typographyVariants` token.
     * Exposed on the theme so components never need a separate import.
     */
    typography: typeof typographyVariants;

    /**
     * Font families — platform-resolved strings.
     */
    fonts: typeof fontFamilies;

    /**
     * Spacing scale — numeric values on a 4pt grid.
     */
    spacing: typeof spacing;

    /**
     * Border radius scale.
     */
    radii: typeof radii;

    /**
     * Shadow definitions per elevation level.
     */
    shadows: typeof shadows;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Narrows an unknown value to Theme. Useful in tests and storybook mocks. */
export type ColorScheme = Theme["colorScheme"];
