import { View as RNView } from 'react-native';

import { type SpacingProp, resolveSpacing } from './spacing-alias';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpacerProps {
    /**
     * When provided the Spacer renders a fixed-size blank space equal to the
     * resolved spacing token value.
     *
     * - In a vertical Stack → becomes a fixed `height`
     * - In a horizontal Stack → becomes a fixed `width`
     *
     * When omitted the Spacer is flexible: it grows to fill all remaining space
     * on the main axis (`flex: 1`). This is the "push siblings apart" pattern.
     *
     * Accepts a named alias ("md") or a numeric token key (4):
     *   <Spacer size="md" />  → 16px fixed gap
     *   <Spacer size={4} />   → 16px fixed gap
     *   <Spacer />            → flex: 1, fills remaining space
     */
    size?: SpacingProp;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Spacer — inserts blank space between siblings inside a Stack.
 *
 * ### Two modes
 *
 * **Flexible** (default — no `size` prop):
 * Grows to fill all available space on the main axis (`flex: 1`).
 * The classic "push to opposite ends" pattern:
 *
 * ```tsx
 * <HStack align="center">
 *   <Text>Left label</Text>
 *   <Spacer />
 *   <Button label="Action" />
 * </HStack>
 * ```
 *
 * **Fixed** (`size` prop provided):
 * Renders a non-growing blank view with a fixed dimension resolved from the
 * spacing token scale. Useful when `gap` on the parent Stack would apply to
 * ALL children but you only need extra space between two specific ones.
 *
 * ```tsx
 * <VStack gap="sm">
 *   <Text>First item</Text>
 *   <Spacer size="lg" />   ← 24px extra gap before this section
 *   <Text variant="heading3">Section title</Text>
 *   <Text>Second item</Text>
 * </VStack>
 * ```
 *
 * ### Why not just `marginTop`?
 * A `Spacer` communicates *intent* at the call site — "there is intentional
 * whitespace here" — rather than forcing the reader to parse a margin value
 * on an unrelated component. It also avoids mutating the child's own spacing,
 * which would break if that child is reused elsewhere without a margin.
 */
export function Spacer({ size }: SpacerProps) {
    if (size !== undefined) {
        const resolvedSize = resolveSpacing(size);

        return (
            <RNView
                style={{
                    width: resolvedSize,
                    height: resolvedSize,
                    flexShrink: 0,
                }}
            />
        );
    }

    return <RNView style={{ flex: 1 }} />;
}
