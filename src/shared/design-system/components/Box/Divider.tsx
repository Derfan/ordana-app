import { View as RNView } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import { resolveSpacing, type SpacingProp } from './spacing-alias';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DividerProps {
  /**
   * Visual axis of the divider.
   *
   * - `"horizontal"` (default) — full-width rule between rows.
   * - `"vertical"` — full-height rule between columns.
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Border color token to use.
   *
   * - `"subtle"` (default) — `theme.colors.border.subtle`, for list separators
   *   and section rules where the divider should fade into the background.
   * - `"default"` — `theme.colors.border.default`, for stronger visual separation
   *   between distinct sections or containers.
   */
  color?: 'subtle' | 'default';

  /**
   * Thickness of the line in pixels. Defaults to `StyleSheet.hairlineWidth`-like
   * 1px — explicit here to keep it token-agnostic and predictable across densities.
   */
  thickness?: number;

  /**
   * Indent from the leading edge — useful for list separators that should
   * align with text rather than bleed to the container edge.
   *
   * Accepts a named alias ("md") or a numeric token key (4).
   *
   * Only applies to `orientation="horizontal"`.
   */
  insetLeft?: SpacingProp;

  /**
   * Indent from the trailing edge.
   *
   * Accepts a named alias ("md") or a numeric token key (4).
   *
   * Only applies to `orientation="horizontal"`.
   */
  insetRight?: SpacingProp;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Divider — a single-pixel rule that separates content regions.
 *
 * ### Orientation
 *
 * **Horizontal** (default):
 * Spans the full width of its container. Use between list rows, between
 * sections inside a card, or anywhere you need a horizontal rule.
 *
 * ```tsx
 * <VStack>
 *   <AccountListItem account={a} />
 *   <Divider />
 *   <AccountListItem account={b} />
 * </VStack>
 * ```
 *
 * **Vertical**:
 * Spans the full height of its flex container. Use inside an `HStack` or
 * a `direction="row"` Box to separate columns.
 *
 * ```tsx
 * <HStack align="center" gap="md">
 *   <StatCell label="Income" value="$1,200" />
 *   <Divider orientation="vertical" />
 *   <StatCell label="Expense" value="$800" />
 * </HStack>
 * ```
 *
 * ### Inset
 *
 * Use `insetLeft` to align a horizontal divider with text content rather
 * than the container edge — the most common pattern in list views:
 *
 * ```tsx
 * <Divider insetLeft="md" />  // 16px left indent, flush right
 * ```
 *
 * ### Color
 *
 * `"subtle"` (default) is appropriate for most cases — list separators,
 * inner card rules. Use `"default"` when the divider must carry more weight,
 * e.g. between two visually distinct panels.
 */
export function Divider({
  orientation = 'horizontal',
  color = 'subtle',
  thickness = 1,
  insetLeft,
  insetRight,
}: DividerProps) {
  const theme = useTheme();

  const borderColor = theme.colors.border[color];

  if (orientation === 'vertical') {
    return (
      <RNView
        style={{
          width: thickness,
          alignSelf: 'stretch',
          backgroundColor: borderColor,
        }}
      />
    );
  }

  return (
    <RNView
      style={{
        height: thickness,
        backgroundColor: borderColor,
        marginLeft: insetLeft !== undefined ? resolveSpacing(insetLeft) : undefined,
        marginRight: insetRight !== undefined ? resolveSpacing(insetRight) : undefined,
      }}
    />
  );
}
