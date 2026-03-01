import { View as RNView, type ViewProps } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { Theme } from '../../theme/theme.types';

type SurfaceKey = keyof Theme['colors']['surface'];

export interface DSViewProps extends ViewProps {
  /**
   * Maps to a `theme.colors.surface` entry.
   * Resolves correctly for the active color scheme.
   * @default 'primary'
   */
  surface?: SurfaceKey;

  /**
   * Escape hatch for one-off background color overrides (e.g. dynamic category tints).
   * When provided, takes precedence over `surface`.
   */
  colorValue?: string;
}

export function View({ surface = 'primary', colorValue, style, ...props }: DSViewProps) {
  const theme = useTheme();

  const backgroundColor = colorValue ?? theme.colors.surface[surface];

  return <RNView style={[{ backgroundColor }, style]} {...props} />;
}
