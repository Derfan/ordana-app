import { semanticColors } from '../tokens/colors';
import { fontFamilies, typographyVariants } from '../tokens/typography';
import { radii } from '../tokens/radii';
import { shadows } from '../tokens/shadows';
import { spacing } from '../tokens/spacing';
import type { Theme } from './theme.types';

export const lightTheme: Theme = {
  colorScheme: 'light',

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
      primary: semanticColors.text.primary.light,
      muted: semanticColors.text.muted.light,
      subtle: semanticColors.text.subtle.light,
      inverse: semanticColors.text.inverse,
      link: semanticColors.text.link,
      placeholder: semanticColors.text.placeholder,
    },

    surface: {
      primary: semanticColors.surface.primary.light,
      subtle: semanticColors.surface.subtle.light,
      muted: semanticColors.surface.muted,
      overlay: semanticColors.surface.overlay,
    },

    border: {
      default: semanticColors.border.default,
      muted: semanticColors.border.muted,
      brandSubtle: semanticColors.border.brand.subtle,
    },

    icon: {
      default: semanticColors.icon.default.light,
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
        text: semanticColors.interactive.ghost.text,
        border: semanticColors.interactive.ghost.border,
      },
    },

    tab: {
      iconDefault: semanticColors.tab.iconDefault.light,
      iconSelected: semanticColors.tab.iconSelected.light,
    },
  },

  typography: typographyVariants,
  fonts: fontFamilies,
  spacing,
  radii,
  shadows,
};
