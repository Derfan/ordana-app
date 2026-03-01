import type { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { Theme } from '../../theme/theme.types';
import { IconSymbol } from '@components/ui/icon-symbol';

type IconColorKey = keyof Theme['colors']['icon'];

export interface IconProps {
  /**
   * SF Symbol name (iOS) / Material Icon name (Android & Web).
   * Uses the same name space as SF Symbols — the cross-platform mapping
   * lives in `icon-symbol.tsx`.
   */
  name: SymbolViewProps['name'];

  /**
   * Rendered size in dp (width & height are equal).
   * @default 24
   */
  size?: number;

  /**
   * Semantic icon color key from `theme.colors.icon`.
   * Resolves correctly for the active color scheme.
   * @default 'default'
   */
  color?: IconColorKey;

  /**
   * Escape hatch for one-off color overrides (e.g. dynamic category colors
   * that come from the database and can't be mapped to a semantic token).
   * When provided, takes precedence over `color`.
   */
  colorValue?: string;

  /**
   * SF Symbol stroke weight (iOS only, ignored on other platforms).
   * @default 'regular'
   */
  weight?: SymbolWeight;

  /** Layout style applied to the wrapping view. */
  style?: StyleProp<ViewStyle>;
}

export function Icon({
  name,
  size = 24,
  color = 'default',
  colorValue,
  weight = 'regular',
  style,
}: IconProps) {
  const theme = useTheme();

  const resolvedColor = colorValue ?? theme.colors.icon[color];

  return (
    <IconSymbol
      name={name}
      size={size}
      color={resolvedColor}
      weight={weight}
      style={style}
    />
  );
}
