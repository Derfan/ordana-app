import { Platform } from 'react-native';

/**
 * Design Token: Shadows
 *
 * Elevation-based shadow scale. iOS and Android use different shadow APIs,
 * so each level exposes both sets of properties — spread them directly onto
 * a StyleSheet object.
 *
 * Usage:
 *   import { shadows } from '@shared/design-system/tokens';
 *   <View style={[styles.card, shadows.md]} />
 */

type IOSShadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
};

type AndroidShadow = {
  elevation: number;
};

type Shadow = IOSShadow & AndroidShadow;

const buildShadow = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number
): Shadow => ({
  // iOS
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  // Android
  elevation,
});

export const shadows = {
  /** No shadow. Useful to explicitly reset elevation on a component. */
  none: buildShadow(0, 0, 0, 0),

  /** Subtle lift — cards, list items, inline chips. */
  xs: buildShadow(1, 2, 0.04, 1),

  /** Default card elevation — account-card, transaction-card. */
  sm: buildShadow(1, 3, 0.06, 2),

  /** Raised surfaces — selected states, focused inputs. */
  md: buildShadow(2, 6, 0.08, 4),

  /** Floating elements — dropdowns, tooltips, popovers. */
  lg: buildShadow(4, 10, 0.1, 8),

  /** Modal sheets, bottom sheets. */
  xl: buildShadow(8, 16, 0.12, 16),

  /** Full-screen overlays. */
  '2xl': buildShadow(12, 24, 0.14, 24),
} as const satisfies Record<string, Shadow>;

export type ShadowLevel = keyof typeof shadows;

/**
 * Coloured shadow — used for brand-tinted card surfaces (e.g. account-card
 * which uses `rgba(0, 122, 255, 0.05)` as a background tint).
 * Only visible on iOS; Android ignores `shadowColor` for coloured shadows.
 */
export const buildColoredShadow = (
  color: string,
  offsetY = 2,
  radius = 8,
  opacity = 0.15,
  elevation = 3
): Shadow => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: Platform.OS === 'ios' ? opacity : 0,
  shadowRadius: radius,
  elevation,
});
