import { View as RNView, type ViewProps } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { ThemeBgColors } from '../../theme/theme.types';

type BgKey = keyof ThemeBgColors;

export interface DSViewProps extends ViewProps {
  /**
   * Maps to a `theme.colors.bg` entry.
   * Resolves correctly for the active color scheme.
   * @default 'page'
   */
  surface?: BgKey;

  /**
   * Escape hatch for one-off background color overrides (e.g. dynamic category tints).
   * When provided, takes precedence over `surface`.
   */
  colorValue?: string;
}

export function View({ surface = 'page', colorValue, style, ...props }: DSViewProps) {
  const theme = useTheme();

  const backgroundColor = colorValue ?? theme.colors.bg[surface];

  return <RNView style={[{ backgroundColor }, style]} {...props} />;
}
