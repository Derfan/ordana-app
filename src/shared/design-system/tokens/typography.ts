/**
 * Design Token: Typography
 *
 * Three-layer architecture:
 *   1. scale      – raw numeric/string values. No semantics.
 *   2. variants   – named text styles that map scale values to intent (heading, body, caption…).
 *   3. families   – platform-aware font family map (mirrors the existing Fonts constant).
 *
 * Rule: components consume `variants` and `families`. Direct `scale` imports are
 * reserved for composing new variants inside this file.
 */

import { Platform } from 'react-native';

// ─── 1. Scale ─────────────────────────────────────────────────────────────────
// Raw values only. No meaning attached.

const scale = {
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  lineHeight: {
    tight: 16,
    snug: 20,
    normal: 22,
    relaxed: 24,
    loose: 30,
    heading: 32,
    display: 40,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  } as const,
} as const;

// ─── 2. Variants ──────────────────────────────────────────────────────────────
// Named text styles consumed by the Text primitive and feature components.
// Every value maps back to a scale entry — no magic numbers beyond this point.

export const typographyVariants = {
  // --- Display / Headings ---
  heading1: {
    fontSize: scale.fontSize['4xl'],    // 32 — screen titles
    lineHeight: scale.lineHeight.heading,
    fontWeight: scale.fontWeight.bold,
  },
  heading2: {
    fontSize: scale.fontSize['3xl'],    // 28
    lineHeight: scale.lineHeight.heading,
    fontWeight: scale.fontWeight.bold,
  },
  heading3: {
    fontSize: scale.fontSize['2xl'],    // 24
    lineHeight: scale.lineHeight.display,
    fontWeight: scale.fontWeight.semibold,
  },

  // --- Subtitle / Section headers ---
  subtitle: {
    fontSize: scale.fontSize.xl,        // 20 — replaces ThemedText type="subtitle"
    lineHeight: scale.lineHeight.display,
    fontWeight: scale.fontWeight.bold,
  },

  // --- Body ---
  body: {
    fontSize: scale.fontSize.base,      // 16 — replaces ThemedText type="default"
    lineHeight: scale.lineHeight.relaxed,
    fontWeight: scale.fontWeight.regular,
  },
  bodyMedium: {
    fontSize: scale.fontSize.base,      // 16
    lineHeight: scale.lineHeight.relaxed,
    fontWeight: scale.fontWeight.medium,
  },
  bodySemibold: {
    fontSize: scale.fontSize.base,      // 16 — replaces ThemedText type="defaultSemiBold"
    lineHeight: scale.lineHeight.relaxed,
    fontWeight: scale.fontWeight.semibold,
  },

  // --- Secondary body (used in transaction/account sub-info) ---
  bodySmall: {
    fontSize: scale.fontSize.md,        // 14
    lineHeight: scale.lineHeight.snug,
    fontWeight: scale.fontWeight.regular,
  },
  bodySmallSemibold: {
    fontSize: scale.fontSize.md,        // 14
    lineHeight: scale.lineHeight.snug,
    fontWeight: scale.fontWeight.semibold,
  },

  // --- Label (form labels, button text) ---
  label: {
    fontSize: scale.fontSize.base,      // 16
    lineHeight: scale.lineHeight.relaxed,
    fontWeight: scale.fontWeight.semibold,
  },
  labelSmall: {
    fontSize: scale.fontSize.md,        // 14
    lineHeight: scale.lineHeight.snug,
    fontWeight: scale.fontWeight.semibold,
  },

  // --- Supporting text ---
  hint: {
    fontSize: scale.fontSize.xs,        // 12 — form hints, timestamps
    lineHeight: scale.lineHeight.tight,
    fontWeight: scale.fontWeight.regular,
  },
  caption: {
    fontSize: scale.fontSize.sm,        // 13 — secondary info in cards
    lineHeight: scale.lineHeight.snug,
    fontWeight: scale.fontWeight.regular,
  },

  // --- Numeric emphasis (balances, amounts) ---
  amount: {
    fontSize: scale.fontSize.lg,        // 18 — transaction amount
    lineHeight: scale.lineHeight.relaxed,
    fontWeight: scale.fontWeight.bold,
  },
  amountLarge: {
    fontSize: scale.fontSize.xl,        // 20 — account balance
    lineHeight: scale.lineHeight.display,
    fontWeight: scale.fontWeight.bold,
  },
  amountInput: {
    fontSize: scale.fontSize['2xl'],    // 24 — amount text input
    lineHeight: scale.lineHeight.display,
    fontWeight: scale.fontWeight.semibold,
  },

  // --- Utility ---
  link: {
    fontSize: scale.fontSize.base,      // 16 — replaces ThemedText type="link"
    lineHeight: scale.lineHeight.loose,
    fontWeight: scale.fontWeight.regular,
  },
  mono: {
    fontSize: scale.fontSize.xs,        // 12 — error stack traces, code
    lineHeight: scale.lineHeight.snug,
    fontWeight: scale.fontWeight.regular,
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

// ─── 3. Families ──────────────────────────────────────────────────────────────
// Platform-aware font family strings.
// Mirrors the existing `Fonts` constant in src/constants/theme.ts so it can
// be dropped in as a direct replacement.

export const fontFamilies = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
}) as {
  sans: string;
  serif: string;
  rounded: string;
  mono: string;
};

// ─── Re-export scale for internal token use only ──────────────────────────────
// Not part of the public design-system barrel.
// Use it only when adding new variants inside this file.
export { scale as _scale };
