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
export { createThemedStyles, useColorScheme, useTheme } from './hooks';

// ─── Primitive Components ─────────────────────────────────────────────────────
export type {
  AppBottomSheetHandle,
  AppBottomSheetProps,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
  BoxProps,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  CardProps,
  DividerProps,
  DSTextProps,
  DSViewProps,
  FormFieldProps,
  IconProps,
  ModalProps,
  SpacerProps,
  SpacingAlias,
  SpacingProp,
  StackProps,
  TextColorKey,
} from './components';
export {
  AppBottomSheet,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FormField,
  HStack,
  Icon,
  Modal,
  resolveSpacing,
  Spacer,
  spacingAliasMap,
  Stack,
  Text,
  useBottomSheetControls,
  useModalFormStyles,
  View,
  VStack,
} from './components';

// ─── Tokens ───────────────────────────────────────────────────────────────────
// Exported for the rare cases where a token value is needed outside a component
// (e.g. passing a color to a third-party charting library like react-native-gifted-charts).
export type {
  RadiusKey,
  ShadowLevel,
  SpacingToken,
  SpacingValue,
  TypographyVariant,
} from './tokens';
export { categoryColors, semanticColors } from './tokens/colors';
export { radii } from './tokens/radii';
export { buildColoredShadow, shadows } from './tokens/shadows';
export { spacing } from './tokens/spacing';
export { fontFamilies, typographyVariants } from './tokens/typography';

// ─── Theme types ──────────────────────────────────────────────────────────────
export type {
  ColorScheme,
  Theme,
  ThemeAccentColors,
  ThemeBgColors,
  ThemeBorderColors,
  ThemeColors,
  ThemeFgColors,
  ThemeInteractiveColors,
  ThemeInteractiveVariant,
  ThemeOverlayColors,
  ThemeTabColors,
} from './theme';
