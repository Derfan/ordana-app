import type { TextProps } from 'react-native';

import type { TypographyVariant } from '../../tokens/typography';
import type { Theme } from '../../theme/theme.types';

export type TextColorKey = keyof Theme['colors']['text'];

export interface DSTextProps extends Omit<TextProps, 'style'> {
  /**
   * Maps to a `typographyVariants` entry.
   * Drives fontSize, lineHeight, and fontWeight all at once.
   * @default 'body'
   */
  variant?: TypographyVariant;

  /**
   * Semantic color key from `theme.colors.text`.
   * Resolves correctly for the active color scheme.
   * @default 'primary'
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
