import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import { Text } from '../Text/Text';

export type BadgeVariant = 'income' | 'expense' | 'neutral' | 'brand' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /**
   * The text label rendered inside the badge.
   * For count badges keep this short (e.g. '3', '99+').
   */
  label: string;

  /**
   * Drives the background + text color pair.
   * - `income`  — green tint, used on income transactions/categories
   * - `expense` — red tint, used on expense transactions/categories
   * - `neutral` — muted gray, used for secondary metadata
   * - `brand`   — brand-color tint, used for selected/active states
   * - `danger`  — solid red, used for destructive indicators
   * @default 'neutral'
   */
  variant?: BadgeVariant;

  /**
   * - `sm` — compact, for inline use inside list rows or chips
   * - `md` — default, for standalone status indicators
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Escape hatch: renders a colored dot to the left of the label.
   * Accepts any CSS/RN color string — designed for dynamic category
   * colors that come from the database and cannot be mapped to a token.
   */
  dotColor?: string;
}

type ColorPair = { background: string; text: string };

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dotColor,
}: BadgeProps) {
  const theme = useTheme();

  const colorMap: Record<BadgeVariant, ColorPair> = {
    income: {
      background: theme.colors.status.incomeSubtle,
      text: theme.colors.status.income,
    },
    expense: {
      background: theme.colors.status.expenseSubtle,
      text: theme.colors.status.expense,
    },
    neutral: {
      background: theme.colors.surface.muted,
      text: theme.colors.text.muted,
    },
    brand: {
      background: theme.colors.brand.subtle,
      text: theme.colors.brand.default,
    },
    danger: {
      background: theme.colors.status.dangerSubtle,
      text: theme.colors.status.danger,
    },
  };

  const paddingMap: Record<BadgeSize, { paddingVertical: number; paddingHorizontal: number }> = {
    sm: { paddingVertical: 2, paddingHorizontal: 6 },
    md: { paddingVertical: 4, paddingHorizontal: 10 },
  };

  const { background, text } = colorMap[variant];
  const padding = paddingMap[size];
  const typographyVariant = size === 'sm' ? 'hint' : 'bodySmallSemibold';

  return (
    <View
      style={[
        styles.base,
        padding,
        { backgroundColor: background },
      ]}
    >
      {dotColor != null && (
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      )}

      <Text
        variant={typographyVariant}
        colorValue={text}
        // Badges must never wrap — truncate with ellipsis if the container is narrow
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
