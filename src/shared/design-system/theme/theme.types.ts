import type { radii } from "../tokens/radii";
import type { shadows } from "../tokens/shadows";
import type { spacing } from "../tokens/spacing";
import type { fontFamilies, typographyVariants } from "../tokens/typography";

/**
 * Theme — Color System
 *
 * Single-layer semantic color model. Components read from `theme.colors`
 * directly — no more hunting across `text.*`, `surface.*`, `status.*` groups.
 *
 * Structure
 * ─────────
 *   theme.colors.fg.*       — foreground: text, icons, inline indicators
 *   theme.colors.bg.*       — background: surfaces, fills, tints
 *   theme.colors.border.*   — borders, dividers, rings
 *   theme.colors.accent.*   — solid intent fills (buttons, badges, indicators)
 *   theme.colors.overlay.*  — scrim / elevation tints
 *   theme.colors.interactive.* — stateful control surfaces (kept separate
 *                                 because they have pressed/disabled sub-states
 *                                 that don't fit the flat model above)
 *   theme.colors.tab.*      — tab-bar specific (navigation concern)
 *
 * Rules
 * ─────
 * 1. Every key answers a UI-role question, not a color-category question.
 * 2. Keys are stable — renaming is a breaking change. Add, never rename.
 * 3. Values differ between light/dark where the scheme demands it.
 * 4. Add a key here before reaching for a raw hex value anywhere.
 */

// ─── Foreground ───────────────────────────────────────────────────────────────

export interface ThemeFgColors {
    /** Primary body text. Highest contrast against the page background. */
    default: string;

    /** Secondary text — captions, labels, supporting info. */
    muted: string;

    /** Tertiary text — hints, timestamps, disabled labels. */
    subtle: string;

    /** Text rendered on top of a filled accent surface (e.g. inside a brand button). */
    onAccent: string;

    /** Hyperlinks and tappable inline text. */
    link: string;

    /** Placeholder text inside text inputs. */
    placeholder: string;

    /** Default icon color — adapts to the active color scheme. */
    icon: string;

    /** Income / positive financial amount or label. */
    positive: string;

    /** Expense / negative financial amount or label. */
    negative: string;

    /** Destructive action label, error message, or danger indicator. */
    danger: string;

    /** Success confirmation text or indicator. */
    success: string;
}

// ─── Background ───────────────────────────────────────────────────────────────

export interface ThemeBgColors {
    /** Root screen / page background. The lowest surface in the stack. */
    page: string;

    /**
     * Card, sheet, and modal background.
     * Sits one elevation above the page — subtly lighter in dark mode
     * to communicate lift without a drop shadow.
     */
    elevated: string;

    /**
     * Recessed surface — section backgrounds inside a card,
     * inactive tab fills, empty-state areas.
     * One step darker/lower than the page background.
     */
    sunken: string;

    /** Muted fill for non-interactive containers — chips, tag pills, skeleton loaders. */
    muted: string;

    /** Subtle green tint behind positive / income indicators. */
    positiveSubtle: string;

    /** Subtle red tint behind negative / expense indicators. */
    negativeSubtle: string;

    /** Subtle red tint behind danger / destructive states. */
    dangerSubtle: string;

    /** Subtle brand-color tint behind selected or active brand states. */
    brandSubtle: string;
}

// ─── Border ───────────────────────────────────────────────────────────────────

export interface ThemeBorderColors {
    /** Default border for inputs, cards, and containers. */
    default: string;

    /** Softer divider — list separators, section rules, subtle inset borders. */
    subtle: string;

    /** Brand-tinted border — focused inputs, selected cards, active controls. */
    brand: string;

    /** Positive / income border — e.g. the active "Income" type toggle. */
    positive: string;

    /** Negative / expense border — e.g. the active "Expense" type toggle. */
    negative: string;

    /** Danger / error border — invalid input ring, destructive confirmation. */
    danger: string;
}

// ─── Accent ───────────────────────────────────────────────────────────────────

export interface ThemeAccentColors {
    /** Primary brand action fill — main button background, active tab indicator. */
    brand: string;

    /**
     * Stronger brand fill — pressed state of the primary button,
     * hover state in web contexts.
     */
    brandStrong: string;

    /**
     * Positive accent fill — solid green used in income badges,
     * income category chips, positive balance indicators.
     */
    positive: string;

    /**
     * Negative accent fill — solid red used in expense badges,
     * expense category chips, negative balance indicators.
     */
    negative: string;

    /** Destructive action fill — delete buttons, irreversible confirmations. */
    danger: string;

    /** Success confirmation fill — completion states, verified indicators. */
    success: string;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export interface ThemeOverlayColors {
    /**
     * Semi-transparent scrim behind modals, bottom sheets, and drawers.
     * Always dark regardless of color scheme — it occludes the content below.
     */
    scrim: string;

    /**
     * Subtle surface tint applied to cards sitting directly on the page
     * background to give them just enough visual lift.
     * Flips direction between schemes: dark tint on light bg, light tint on dark bg.
     */
    card: string;
}

// ─── Interactive ──────────────────────────────────────────────────────────────
// Kept as a separate group because interactive controls have pressed/disabled
// sub-states that don't map cleanly to the flat fg/bg/border model above.

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

// ─── Tab ──────────────────────────────────────────────────────────────────────
// Navigation concern — kept separate so the tab bar component doesn't need
// to derive its colors from the generic fg/bg groups.

export interface ThemeTabColors {
    iconDefault: string;
    iconSelected: string;
}

// ─── Composed ThemeColors ─────────────────────────────────────────────────────

export interface ThemeColors {
    fg: ThemeFgColors;
    bg: ThemeBgColors;
    border: ThemeBorderColors;
    accent: ThemeAccentColors;
    overlay: ThemeOverlayColors;
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

// ─── Utilities ────────────────────────────────────────────────────────────────

export type ColorScheme = Theme["colorScheme"];
