import type { ViewStyle } from "react-native";

import { Box, type BoxProps } from "./Box";
import type { SpacingProp } from "./spacing-alias";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StackProps extends Omit<
    BoxProps,
    "direction" | "gap" | "align" | "justify"
> {
    /**
     * The axis children are laid out along.
     * @default 'vertical'
     */
    direction?: "vertical" | "horizontal";

    /**
     * Uniform gap between every child.
     * Accepts a named alias ("sm") or a numeric token key (2).
     * @default 'none'
     */
    gap?: SpacingProp;

    /**
     * How children are aligned on the cross-axis.
     *
     * For a vertical stack this controls horizontal alignment:
     *   - 'start'    → alignItems: 'flex-start'
     *   - 'center'   → alignItems: 'center'
     *   - 'end'      → alignItems: 'flex-end'
     *   - 'stretch'  → alignItems: 'stretch' (default)
     *
     * For a horizontal stack this controls vertical alignment:
     *   - 'start'    → alignItems: 'flex-start'
     *   - 'center'   → alignItems: 'center'
     *   - 'end'      → alignItems: 'flex-end'
     *   - 'stretch'  → alignItems: 'stretch' (default)
     */
    align?: "start" | "center" | "end" | "stretch";

    /**
     * How children are distributed along the main axis.
     *
     *   - 'start'    → justifyContent: 'flex-start' (default)
     *   - 'center'   → justifyContent: 'center'
     *   - 'end'      → justifyContent: 'flex-end'
     *   - 'between'  → justifyContent: 'space-between'
     *   - 'around'   → justifyContent: 'space-around'
     *   - 'evenly'   → justifyContent: 'space-evenly'
     */
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALIGN_MAP: Record<
    NonNullable<StackProps["align"]>,
    ViewStyle["alignItems"]
> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
};

const JUSTIFY_MAP: Record<
    NonNullable<StackProps["justify"]>,
    ViewStyle["justifyContent"]
> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Stack — lays children out along a single axis with uniform gap.
 *
 * Built directly on `Box` — every `Box` prop is available. `Stack` only adds
 * the `direction` shorthand and the semantic `align` / `justify` aliases that
 * map verbose `flexStart` strings to readable names.
 *
 * ### Directional aliases
 * For convenience, `HStack` and `VStack` are exported as pre-configured
 * variants. Prefer them when the direction never changes:
 *
 *   <VStack gap="md">…</VStack>
 *   <HStack gap="sm" align="center">…</HStack>
 *
 * ### When to use Stack vs Box
 * - Use `Stack` when you have a list of children that need uniform spacing.
 * - Use `Box` directly when you need full flex control (mixed gaps, wrapping
 *   grids, or a single child that just needs padding).
 *
 * @example
 * // Vertical list with 16px gaps, children centered horizontally
 * <Stack gap="md" align="center">
 *   <Text variant="heading2">Title</Text>
 *   <Text color="muted">Subtitle</Text>
 * </Stack>
 *
 * @example
 * // Horizontal row, items spaced apart, vertically centered
 * <HStack justify="between" align="center" paddingX="md">
 *   <Text>Left</Text>
 *   <Button label="Action" />
 * </HStack>
 */
export function Stack({
    direction = "vertical",
    gap,
    align,
    justify,
    ...boxProps
}: StackProps) {
    const flexDirection: ViewStyle["flexDirection"] =
        direction === "horizontal" ? "row" : "column";

    const resolvedAlign = align !== undefined ? ALIGN_MAP[align] : undefined;
    const resolvedJustify =
        justify !== undefined ? JUSTIFY_MAP[justify] : undefined;

    return (
        <Box
            direction={flexDirection}
            gap={gap}
            align={resolvedAlign}
            justify={resolvedJustify}
            {...boxProps}
        />
    );
}

// ─── Directional aliases ──────────────────────────────────────────────────────

/**
 * VStack — vertical Stack (column). The most common layout pattern.
 *
 * @example
 * <VStack gap="md" padding="lg">
 *   <Text variant="heading1">Title</Text>
 *   <Text color="muted">Description</Text>
 *   <Button label="Continue" />
 * </VStack>
 */
export function VStack(props: Omit<StackProps, "direction">) {
    return <Stack direction="vertical" {...props} />;
}

/**
 * HStack — horizontal Stack (row).
 *
 * @example
 * <HStack gap="sm" align="center">
 *   <Icon name="star" />
 *   <Text>Label</Text>
 * </HStack>
 */
export function HStack(props: Omit<StackProps, "direction">) {
    return <Stack direction="horizontal" {...props} />;
}
