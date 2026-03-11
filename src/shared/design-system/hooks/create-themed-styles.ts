import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { darkTheme, lightTheme } from '../theme';
import type { Theme } from '../theme/theme.types';
import { useColorScheme } from './use-color-scheme';

/**
 * A factory function that receives the active Theme and returns a plain styles
 * object. The return type must be compatible with `StyleSheet.create` — i.e. a
 * record of `ViewStyle | TextStyle | ImageStyle` values.
 *
 * Defined ONCE at module level (outside any component), so the reference is
 * stable and never recreated on render.
 */
type StylesFactory<T extends StyleSheet.NamedStyles<T>> = (theme: Theme) => T;

/**
 * createThemedStyles
 *
 * Defines a themed stylesheet factory outside the component tree and returns a
 * hook that resolves it against the active color scheme.
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 *   // 1. Define once at module level — zero runtime cost until the hook is called
 *   const useStyles = createThemedStyles((theme) =>
 *     StyleSheet.create({
 *       container: {
 *         flex: 1,
 *         backgroundColor: theme.colors.bg.page,
 *         padding: theme.spacing[5],
 *       },
 *       title: {
 *         ...theme.typography.heading1,
 *         color: theme.colors.fg.default,
 *       },
 *     })
 *   );
 *
 *   // 2. Call inside the component — styles are memoized per color scheme
 *   export function MyScreen() {
 *     const styles = useStyles();
 *     return <View style={styles.container} />;
 *   }
 *
 * ─── Why this pattern ─────────────────────────────────────────────────────────
 *
 * - The factory is defined at module scope → it is a stable reference, never
 *   re-allocated on re-render.
 * - `StyleSheet.create` runs inside `useMemo` keyed on `colorScheme`, so the
 *   stylesheet is only recomputed when the user switches light ↔ dark — not on
 *   every render.
 * - The returned object is a real `StyleSheet` (integer-keyed in production),
 *   which means React Native's bridge sends style IDs instead of full objects.
 * - Spacing, radii and shadow tokens are scheme-independent, so they resolve to
 *   static numbers inside the factory — same benefit as a plain `StyleSheet.create`.
 * - Color tokens are scheme-dependent and resolve correctly because `useTheme()`
 *   returns the right theme object for the active scheme.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────────
 *
 * - Always call `createThemedStyles` at module level, NEVER inside a component
 *   or another hook. Defining it inside a component re-creates the factory
 *   reference on every render and defeats the memoization.
 *
 *   ✅  const useStyles = createThemedStyles((theme) => StyleSheet.create({...}));
 *       export function MyComponent() { const styles = useStyles(); ... }
 *
 *   ❌  export function MyComponent() {
 *         const useStyles = createThemedStyles(...); // re-created every render
 *         const styles = useStyles();
 *       }
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: StylesFactory<T>,
): () => T {
  return function useThemedStyles(): T {
    const colorScheme = useColorScheme();

    // Resolve the theme from the scheme string — this is the same logic as
    // useTheme() but kept inline so `colorScheme` is the sole memo dependency.
    // Memoizing on a stable string primitive instead of the theme object
    // reference satisfies exhaustive-deps without capturing a new object
    // identity on every render.
    return useMemo(() => {
      const theme: Theme = colorScheme === 'dark' ? darkTheme : lightTheme;
      return factory(theme);
    }, [colorScheme]);
  };
}
