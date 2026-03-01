/**
 * Design Token: Spacing
 *
 * Built on a 4pt base grid — every value is a multiple of 4.
 * This ensures visual consistency across all layouts.
 *
 * Usage:
 *   import { spacing } from '@shared/design-system/tokens/spacing';
 *   paddingHorizontal: spacing[4]  // → 16
 *   gap: spacing[3]                // → 12
 *
 * Rule: never use raw numeric spacing values in components.
 * Always reference a named token from this scale.
 */

export const spacing = {
  /** 0px */
  0: 0,
  /** 2px — hairline, dividers */
  0.5: 2,
  /** 4px — tightest internal gap (e.g. icon + label) */
  1: 4,
  /** 6px */
  1.5: 6,
  /** 8px — compact padding, small gaps */
  2: 8,
  /** 10px */
  2.5: 10,
  /** 12px — default gap between related elements */
  3: 12,
  /** 14px */
  3.5: 14,
  /** 16px — standard component padding */
  4: 16,
  /** 20px — section internal padding */
  5: 20,
  /** 24px — section gaps */
  6: 24,
  /** 28px */
  7: 28,
  /** 32px — large section separation */
  8: 32,
  /** 36px */
  9: 36,
  /** 40px — modal / screen vertical padding */
  10: 40,
  /** 48px */
  12: 48,
  /** 56px */
  14: 56,
  /** 64px */
  16: 64,
  /** 80px */
  20: 80,
  /** 96px */
  24: 96,
} as const;

export type SpacingToken = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingToken];
