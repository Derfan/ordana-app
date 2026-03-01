import { Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import type { ShadowLevel } from '../../tokens/shadows';
import type { Theme } from '../../theme/theme.types';

type SurfaceKey = keyof Theme['colors']['surface'];

export interface CardProps extends Omit<PressableProps, 'style'> {
  /**
   * Surface color key from `theme.colors.surface`.
   * @default 'primary'
   */
  surface?: SurfaceKey;

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
  surface = 'primary',
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

  const backgroundColor = colorValue ?? theme.colors.surface[surface];
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
