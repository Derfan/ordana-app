/**
 * Design Token: Radii
 *
 * Border radius scale derived from all borderRadius values found across the codebase.
 * Named by intent, not by pixel value — components import the semantic name.
 *
 * Inventory of raw values found in the app:
 *   6   → colorIndicator dot, legend dot (half of 12px element)
 *   8   → inputs, buttons, small cards, error details
 *   12  → cards, modals, icon containers, type buttons
 *   16  → delete button (half of 32px element — circle)
 *   20  → pill/chip buttons (account selector, category selector)
 *   24  → icon circle container (half of 48px element)
 *   9999 → full pill — any value large enough to guarantee full rounding
 */

export const radii = {
  /** 4px — tight rounding, badges, tags */
  xs: 4,

  /** 6px — small dots, indicators */
  dot: 6,

  /** 8px — inputs, small buttons, code blocks */
  sm: 8,

  /** 12px — cards, modals, tile buttons */
  md: 12,

  /** 16px — circle buttons (used as half of a 32px element) */
  circle: 16,

  /** 20px — pill chips (account/category selector buttons) */
  pill: 20,

  /** 24px — large icon circle containers (half of 48px element) */
  iconCircle: 24,

  /** 9999px — always fully rounded, regardless of element height */
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radii;
