import { useMemo } from 'react';
import { View as RNView, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { ThemeBgColors } from '../../theme/theme.types';
import type { SpacingProp } from './spacing-alias';
import { resolveSpacing } from './spacing-alias';

// ─── Types ────────────────────────────────────────────────────────────────────

type SurfaceKey = keyof ThemeBgColors;

export interface BoxProps extends Omit<ViewProps, 'style'> {
  // ─── Spacing ──────────────────────────────────────────────────────────────

  /** Padding on all sides. */
  padding?: SpacingProp;
  /** Padding on the horizontal axis (left + right). */
  paddingX?: SpacingProp;
  /** Padding on the vertical axis (top + bottom). */
  paddingY?: SpacingProp;
  /** Padding on the top side. */
  paddingTop?: SpacingProp;
  /** Padding on the bottom side. */
  paddingBottom?: SpacingProp;
  /** Padding on the left side. */
  paddingLeft?: SpacingProp;
  /** Padding on the right side. */
  paddingRight?: SpacingProp;

  /** Margin on all sides. */
  margin?: SpacingProp;
  /** Margin on the horizontal axis (left + right). */
  marginX?: SpacingProp;
  /** Margin on the vertical axis (top + bottom). */
  marginY?: SpacingProp;
  /** Margin on the top side. */
  marginTop?: SpacingProp;
  /** Margin on the bottom side. */
  marginBottom?: SpacingProp;
  /** Margin on the left side. */
  marginLeft?: SpacingProp;
  /** Margin on the right side. */
  marginRight?: SpacingProp;

  // ─── Flex ─────────────────────────────────────────────────────────────────

  /** `flex` shorthand. `true` maps to `flex: 1`. */
  flex?: number | boolean;
  /** Sets `flexDirection`. */
  direction?: ViewStyle['flexDirection'];
  /** Sets `alignItems`. Raw flex string — use `Stack` for the readable alias API. */
  align?: ViewStyle['alignItems'];
  /** Sets `justifyContent`. Raw flex string — use `Stack` for the readable alias API. */
  justify?: ViewStyle['justifyContent'];
  /** Sets `flexWrap`. */
  wrap?: ViewStyle['flexWrap'];
  /** Gap between children on both axes. */
  gap?: SpacingProp;
  /** Gap between children on the horizontal axis only. */
  gapX?: SpacingProp;
  /** Gap between children on the vertical axis only. */
  gapY?: SpacingProp;

  // ─── Surface ──────────────────────────────────────────────────────────────

  /**
   * Semantic background color from `theme.colors.bg`.
   * When omitted the Box is transparent — unlike the `View` primitive which
   * defaults to `surface="page"`. Box is a layout primitive first;
   * background is opt-in.
   */
  surface?: SurfaceKey;

  /**
   * Escape hatch for dynamic or one-off background colors.
   * Takes precedence over `surface`.
   */
  bg?: string;

  // ─── Layout ───────────────────────────────────────────────────────────────

  /** Sets `width`. */
  width?: ViewStyle['width'];
  /** Sets `height`. */
  height?: ViewStyle['height'];
  /** Sets `borderRadius`. Accepts raw numbers (from the `radii` token). */
  radius?: number;

  // ─── Style escape hatch ───────────────────────────────────────────────────

  /**
   * Raw style override. Applied last — takes precedence over all token props.
   * Keep this stable (module-level StyleSheet or a ref) to avoid defeating
   * the memoization of the token-derived style.
   */
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Box — the base layout primitive.
 *
 * ### Rendering
 * The token-derived style object is memoized with `useMemo`. It is only
 * recomputed when a layout prop or the color scheme actually changes.
 * The `style` override is merged at render outside the memo — same contract
 * as React Native's own StyleSheet API (caller is responsible for stability).
 *
 * ### Token props
 * Spacing props accept either a named alias or a numeric scale key:
 *   <Box padding="md" />    → 16px  (alias)
 *   <Box padding={4} />     → 16px  (numeric token key)
 *
 * ### Background
 * Box is transparent by default. Use `surface` or `bg` for backgrounds:
 *   <Box surface="subtle" padding="md">…</Box>
 *
 * ### Composition
 * Box is the foundation for `Stack` and `Spacer`. Prefer those for
 * directional layouts; reach for Box when you need full control.
 *
 * @example
 * <Box padding="md" gap="sm" direction="row" align="center">
 *   <Icon name="star" />
 *   <Text>Label</Text>
 * </Box>
 */
export function Box({
  // spacing
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  // flex
  flex,
  direction,
  align,
  justify,
  wrap,
  gap,
  gapX,
  gapY,
  // surface
  surface,
  bg,
  // layout
  width,
  height,
  radius,
  // style override
  style,
  // native view props
  ...viewProps
}: BoxProps) {
  // `surface` requires a theme lookup — include colorScheme in deps so the
  // style updates correctly when the user switches light ↔ dark.
  const theme = useTheme();

  const tokenStyle = useMemo<ViewStyle>(() => {
    const s: ViewStyle = {};

    // ─── Padding ──────────────────────────────────────────────────────────
    // Specificity order mirrors CSS: shorthand → axis → side.
    // Later keys overwrite earlier ones, so `paddingTop` wins over `paddingY`.
    if (padding !== undefined) s.padding = resolveSpacing(padding);
    if (paddingX !== undefined) s.paddingHorizontal = resolveSpacing(paddingX);
    if (paddingY !== undefined) s.paddingVertical = resolveSpacing(paddingY);
    if (paddingTop !== undefined) s.paddingTop = resolveSpacing(paddingTop);
    if (paddingBottom !== undefined) s.paddingBottom = resolveSpacing(paddingBottom);
    if (paddingLeft !== undefined) s.paddingLeft = resolveSpacing(paddingLeft);
    if (paddingRight !== undefined) s.paddingRight = resolveSpacing(paddingRight);

    // ─── Margin ───────────────────────────────────────────────────────────
    if (margin !== undefined) s.margin = resolveSpacing(margin);
    if (marginX !== undefined) s.marginHorizontal = resolveSpacing(marginX);
    if (marginY !== undefined) s.marginVertical = resolveSpacing(marginY);
    if (marginTop !== undefined) s.marginTop = resolveSpacing(marginTop);
    if (marginBottom !== undefined) s.marginBottom = resolveSpacing(marginBottom);
    if (marginLeft !== undefined) s.marginLeft = resolveSpacing(marginLeft);
    if (marginRight !== undefined) s.marginRight = resolveSpacing(marginRight);

    // ─── Flex ─────────────────────────────────────────────────────────────
    if (flex !== undefined) s.flex = flex === true ? 1 : (flex as number);
    if (direction !== undefined) s.flexDirection = direction;
    if (align !== undefined) s.alignItems = align;
    if (justify !== undefined) s.justifyContent = justify;
    if (wrap !== undefined) s.flexWrap = wrap;
    if (gap !== undefined) s.gap = resolveSpacing(gap);
    if (gapX !== undefined) s.columnGap = resolveSpacing(gapX);
    if (gapY !== undefined) s.rowGap = resolveSpacing(gapY);

    // ─── Surface ──────────────────────────────────────────────────────────
    // `bg` takes precedence; `surface` resolves through the theme.
    if (bg !== undefined) s.backgroundColor = bg;
    else if (surface !== undefined) s.backgroundColor = theme.colors.bg[surface];

    // ─── Layout ───────────────────────────────────────────────────────────
    if (width !== undefined) s.width = width;
    if (height !== undefined) s.height = height;
    if (radius !== undefined) s.borderRadius = radius;

    return s;
  }, [
    // spacing
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    // flex
    flex,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    // surface
    surface,
    bg,
    // theme — only changes on light ↔ dark switch, not on every render
    theme.colors.bg,
    // layout
    width,
    height,
    radius,
  ]);

  // `style` is intentionally outside the memo.
  // It is the caller's responsibility to keep it stable (a module-level
  // StyleSheet entry or a ref). Merging it here means the array only
  // allocates a new reference when `tokenStyle` itself changes.
  return <RNView style={style ? [tokenStyle, style] : tokenStyle} {...viewProps} />;
}
