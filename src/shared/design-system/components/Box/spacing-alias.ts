import { spacing, type SpacingToken } from "../../tokens/spacing";

// ─── Named alias map ──────────────────────────────────────────────────────────
//
// The raw spacing scale uses numeric keys (1, 2, 3…) which are precise and
// consistent but verbose at the call site:
//
//   <Box padding={4} />   — works, but "4" has no obvious meaning
//   <Box padding="md" />  — reads as intent, maps to spacing[4] → 16px
//
// This alias layer sits ON TOP of the numeric scale — it does not replace it.
// Both APIs are valid:
//
//   <Box gap={3} />      — numeric token key  → spacing[3]  → 12px
//   <Box gap="sm" />     — named alias        → spacing[3]  → 12px
//
// Rule: aliases map to the most common, "natural" stop on the scale for that
// semantic intent. They are not arbitrary — each is anchored to a real token.

export const spacingAliasMap = {
    none: spacing[0], //  0px — explicit zero (margin reset, no gap)
    xs: spacing[1], //  4px — tightest gap (icon + label)
    sm: spacing[2], //  8px — compact gaps, small internal padding
    md: spacing[4], // 16px — standard component padding / default gap
    lg: spacing[6], // 24px — section-level separation
    xl: spacing[8], // 32px — large section gaps
    "2xl": spacing[10], // 40px — modal / screen vertical padding
} as const;

export type SpacingAlias = keyof typeof spacingAliasMap;

/**
 * A spacing prop accepts either a named alias ("md") or a numeric token
 * key (4) — both resolve to the same pixel value via `resolveSpacing`.
 */
export type SpacingProp = SpacingAlias | SpacingToken;

/**
 * Resolves a SpacingProp to a concrete pixel value.
 *
 * - Named alias  → looks up spacingAliasMap
 * - Numeric key  → looks up spacing scale directly
 *
 * Called at render time inside layout primitives — no hooks, no side effects.
 */
export function resolveSpacing(value: SpacingProp): number {
    if (typeof value === "string") {
        return spacingAliasMap[value as SpacingAlias];
    }
    return spacing[value as SpacingToken];
}
