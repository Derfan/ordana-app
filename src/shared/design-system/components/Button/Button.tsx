import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import { Text } from '../Text/Text';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

const PADDING_MAP: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 16 },
  lg: { paddingVertical: 16, paddingHorizontal: 24 },
};

const TYPOGRAPHY_MAP: Record<ButtonSize, 'labelSmall' | 'label' | 'label'> = {
  sm: 'labelSmall',
  md: 'label',
  lg: 'label',
};

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  const isInteractive = !disabled && !loading;

  const backgroundColors: Record<ButtonVariant, string> = {
    primary: theme.colors.interactive.primary.background,
    destructive: theme.colors.interactive.destructive.background,
    ghost: theme.colors.interactive.ghost.background,
  };

  const textColors: Record<ButtonVariant, string> = {
    primary: theme.colors.interactive.primary.text,
    destructive: theme.colors.interactive.destructive.text,
    ghost: theme.colors.interactive.ghost.text,
  };

  const pressedBackgroundColors: Record<ButtonVariant, string> = {
    primary: theme.colors.interactive.primary.backgroundPressed ?? theme.colors.brand.strong,
    destructive: theme.colors.status.danger,
    ghost: theme.colors.surface.muted,
  };

  const padding = PADDING_MAP[size];
  const typographyVariant = TYPOGRAPHY_MAP[size];
  const textColor = textColors[variant];
  const backgroundColor = backgroundColors[variant];

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      style={({ pressed }) => [
        styles.base,
        padding,
        { backgroundColor: pressed && isInteractive ? pressedBackgroundColors[variant] : backgroundColor },
        variant === 'ghost' && { borderWidth: 1, borderColor: theme.colors.border.default },
        !isInteractive && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

          <Text
            variant={typographyVariant}
            colorValue={textColor}
          >
            {label}
          </Text>

          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
