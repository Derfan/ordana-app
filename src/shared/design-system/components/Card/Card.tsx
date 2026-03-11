import { Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { ThemeBgColors } from '../../theme/theme.types';
import type { ShadowLevel } from '../../tokens/shadows';

type BgKey = keyof ThemeBgColors;

export interface CardProps extends Omit<PressableProps, 'style'> {
  /**
   * Background color key from `theme.colors.bg`.
   * Resolves correctly for the active color scheme.
   * @default 'elevated'
   */
  surface?: BgKey;

  /**
   * Escape hatch for dynamic background colors (e.g. category tints from the DB).
   * Takes precedence over `surface`.
   */
  colorValue?: string;

  /**
   * Shadow elevation level.
   * @default 'sm'
   */
  elevation?: ShadowLevel;

  /**
   * Opacity applied when the card is pressed.
   * Set to 1 to disable the press feedback.
   * @default 0.7
   */
  pressedOpacity?: number;

  style?: ViewStyle;

  children?: React.ReactNode;
}

export function Card({
  surface = 'elevated',
  colorValue,
  elevation = 'sm',
  pressedOpacity = 0.7,
  style,
  children,
  onPress,
  onLongPress,
  ...rest
}: CardProps) {
  const theme = useTheme();

  const backgroundColor = colorValue ?? theme.colors.bg[surface];
  const shadowStyle = theme.shadows[elevation];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        {
          backgroundColor,
          borderRadius: theme.radii.md,
          overflow: 'hidden',
        },
        shadowStyle,
        style,
        pressed && onPress != null && { opacity: pressedOpacity },
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
