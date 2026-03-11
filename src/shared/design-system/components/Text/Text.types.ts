import type { TextProps } from 'react-native';

import type { ThemeFgColors } from '../../theme/theme.types';
import type { TypographyVariant } from '../../tokens/typography';

export type TextColorKey = keyof ThemeFgColors;

export interface DSTextProps extends Omit<TextProps, 'style'> {
  /**
   * Maps to a `typographyVariants` entry.
   * Drives fontSize, lineHeight, and fontWeight all at once.
   * @default 'body'
   */
  variant?: TypographyVariant;

  /**
   * Semantic color key from `theme.colors.fg`.
   * Resolves correctly for the active color scheme.
   * @default 'default'
   */
  color?: TextColorKey;

  /**
   * Escape hatch for one-off color overrides (e.g. dynamic category colors from the DB).
   * When provided, takes precedence over `color`.
   */
  colorValue?: string;

  /**
   * Escape hatch for layout and one-off style overrides.
   * Typography (fontSize, fontWeight, lineHeight) should come from `variant` — not here.
   */
  style?: TextProps['style'];
}
