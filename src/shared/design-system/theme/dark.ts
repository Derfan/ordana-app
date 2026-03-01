import { semanticColors } from '../tokens/colors';
import { fontFamilies, typographyVariants } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { radii } from '../tokens/radii';
import { shadows } from '../tokens/shadows';
import type { Theme } from './theme.types';

export const darkTheme: Theme = {
  colorScheme: 'dark',

  colors: {
    brand: {
      default: semanticColors.brand.default,
      subtle: semanticColors.brand.subtle,
      strong: semanticColors.brand.strong,
    },

    status: {
      income: semanticColors.status.income,
      incomeSubtle: semanticColors.status.incomeSubtle,
      incomeBorder: semanticColors.status.incomeBorder,
      expense: semanticColors.status.expense,
      expenseSubtle: semanticColors.status.expenseSubtle,
      expenseBorder: semanticColors.status.expenseBorder,
      danger: semanticColors.status.danger,
      dangerSubtle: semanticColors.status.dangerSubtle,
      success: semanticColors.status.success,
      error: semanticColors.status.error,
    },

    text: {
      primary: semanticColors.text.primary.dark,
      muted: semanticColors.text.muted.dark,
      subtle: semanticColors.text.subtle.dark,
      inverse: semanticColors.text.inverse,
      link: semanticColors.text.link,
      placeholder: semanticColors.text.placeholder,
    },

    surface: {
      primary: semanticColors.surface.primary.dark,
      subtle: semanticColors.surface.subtle.dark,
      muted: semanticColors.surface.muted,
      overlay: semanticColors.surface.overlay,
    },

    border: {
      default: semanticColors.border.default,
      muted: semanticColors.border.muted,
      brandSubtle: semanticColors.border.brand.subtle,
    },

    icon: {
      default: semanticColors.icon.default.dark,
      brand: semanticColors.icon.brand,
      close: semanticColors.icon.close,
    },

    interactive: {
      primary: {
        background: semanticColors.interactive.primary.background,
        text: semanticColors.interactive.primary.text,
        backgroundPressed: semanticColors.interactive.primary.backgroundPressed,
      },
      destructive: {
        background: semanticColors.interactive.destructive.background,
        text: semanticColors.interactive.destructive.text,
      },
      ghost: {
        background: semanticColors.interactive.ghost.background,
        border: semanticColors.interactive.ghost.border,
        text: semanticColors.interactive.ghost.text,
      },
    },

    tab: {
      iconDefault: semanticColors.tab.iconDefault.dark,
      iconSelected: semanticColors.tab.iconSelected.dark,
    },
  },

  typography: typographyVariants,
  fonts: fontFamilies,
  spacing,
  radii,
  shadows,
};
