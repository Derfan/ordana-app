/**
 * Design System — Public API
 *
 * This is the ONLY file feature code should import from.
 *
 *   import { Text, Button, useTheme, spacing } from '@shared/design-system';
 *
 * Internal paths (tokens/*, theme/*, components/*, hooks/*) are implementation
 * details. Importing them directly in feature code is an anti-pattern — it
 * bypasses this contract and makes internal refactoring a breaking change.
 *
 * What is NOT exported here:
 *   - `_palette`  — raw hex palette, internal token use only
 *   - `_scale`    — raw typography scale, internal token use only
 *   - `lightTheme` / `darkTheme` — direct theme objects bypass color scheme
 *                                   resolution; use `useTheme()` instead
 */

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useTheme, useColorScheme } from './hooks';

// ─── Primitive Components ─────────────────────────────────────────────────────
export { Text, View, Button, Card, Icon, Modal, Badge, useModalFormStyles } from './components';
export type {
  DSTextProps,
  TextColorKey,
  DSViewProps,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  CardProps,
  IconProps,
  ModalProps,
  BadgeProps,
  BadgeVariant,
  BadgeSize,
} from './components';

// ─── Tokens ───────────────────────────────────────────────────────────────────
// Exported for the rare cases where a token value is needed outside a component
// (e.g. passing a color to a third-party charting library like react-native-gifted-charts).
export { semanticColors, categoryColors } from './tokens/colors';
export { spacing } from './tokens/spacing';
export { radii } from './tokens/radii';
export { shadows, buildColoredShadow } from './tokens/shadows';
export { typographyVariants, fontFamilies } from './tokens/typography';
export type {
  RadiusKey,
  SpacingToken,
  SpacingValue,
  ShadowLevel,
  TypographyVariant,
} from './tokens';

// ─── Theme types ──────────────────────────────────────────────────────────────
export type {
  Theme,
  ColorScheme,
  ThemeColors,
  ThemeBrandColors,
  ThemeStatusColors,
  ThemeTextColors,
  ThemeSurfaceColors,
  ThemeBorderColors,
  ThemeIconColors,
  ThemeInteractiveColors,
  ThemeInteractiveVariant,
  ThemeTabColors,
} from './theme';
