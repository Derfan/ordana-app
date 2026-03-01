import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import type { ColorScheme } from '../theme/theme.types';

/**
 * SSR-safe color scheme hook for web.
 *
 * React Native Web renders on the server without access to `window.matchMedia`,
 * so `useColorScheme` returns `null` during SSR / the first hydration frame.
 * Returning 'light' as the default prevents a flash of unstyled / wrong-theme
 * content before the client re-renders with the real value.
 *
 * On native platforms this file is never loaded — the sibling
 * `use-color-scheme.ts` (which simply re-exports from 'react-native') is used
 * instead via Metro's platform extension resolution.
 */
export function useColorScheme(): ColorScheme {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (!hasHydrated) {
    return 'light';
  }

  return colorScheme ?? 'light';
}
