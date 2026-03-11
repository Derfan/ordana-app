import { semanticColors } from '../tokens/colors';
import { radii } from '../tokens/radii';
import { shadows } from '../tokens/shadows';
import { spacing } from '../tokens/spacing';
import { fontFamilies, typographyVariants } from '../tokens/typography';
import type { Theme } from './theme.types';

export const lightTheme: Theme = {
  colorScheme: 'light',

  colors: {
    fg: {
      default: semanticColors.text.primary.light,
      muted: semanticColors.text.muted.light,
      subtle: semanticColors.text.subtle.light,
      onAccent: semanticColors.text.inverse,
      link: semanticColors.text.link,
      placeholder: semanticColors.text.placeholder,
      icon: semanticColors.icon.default.light,
      positive: semanticColors.status.income,
      negative: semanticColors.status.expense,
      danger: semanticColors.status.danger,
      success: semanticColors.status.success,
    },

    bg: {
      page: semanticColors.surface.primary.light,
      // Cards sit on the same white surface in light mode —
      // elevation is communicated via shadow, not background shift.
      elevated: semanticColors.surface.primary.light,
      sunken: semanticColors.surface.subtle.light,
      muted: semanticColors.surface.muted,
      positiveSubtle: semanticColors.status.incomeSubtle,
      negativeSubtle: semanticColors.status.expenseSubtle,
      dangerSubtle: semanticColors.status.dangerSubtle,
      brandSubtle: semanticColors.brand.subtle,
    },

    border: {
      default: semanticColors.border.default,
      subtle: semanticColors.border.muted,
      brand: semanticColors.brand.default,
      positive: semanticColors.status.incomeBorder,
      negative: semanticColors.status.expenseBorder,
      danger: semanticColors.status.error,
    },

    accent: {
      brand: semanticColors.brand.default,
      brandStrong: semanticColors.brand.strong,
      positive: semanticColors.status.income,
      negative: semanticColors.status.expense,
      danger: semanticColors.status.danger,
      success: semanticColors.status.success,
    },

    overlay: {
      scrim: 'rgba(0, 0, 0, 0.5)',
      // Barely-visible dark tint gives cards just enough lift on white.
      card: semanticColors.surface.overlay,
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
