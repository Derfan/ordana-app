import { semanticColors } from "../tokens/colors";
import { fontFamilies, typographyVariants } from "../tokens/typography";
import { spacing } from "../tokens/spacing";
import { radii } from "../tokens/radii";
import { shadows } from "../tokens/shadows";
import type { Theme } from "./theme.types";

export const darkTheme: Theme = {
    colorScheme: "dark",

    colors: {
        fg: {
            default: semanticColors.text.primary.dark,
            muted: semanticColors.text.muted.dark,
            subtle: semanticColors.text.subtle.dark,
            onAccent: semanticColors.text.inverse,
            link: semanticColors.text.link,
            placeholder: semanticColors.text.placeholder,
            icon: semanticColors.icon.default.dark,
            positive: semanticColors.status.income,
            negative: semanticColors.status.expense,
            danger: semanticColors.status.danger,
            success: semanticColors.status.success,
        },

        bg: {
            // Near-black root background.
            page: semanticColors.surface.primary.dark,
            // Cards sit one step above the page — slightly lighter dark tone.
            elevated: "#1c1e1f",
            // Recessed fills: inactive tabs, section insets, empty states.
            sunken: semanticColors.surface.subtle.dark,
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
            // Scrim always darkens — scheme-independent.
            scrim: "rgba(0, 0, 0, 0.5)",
            // On a dark background a white tint communicates lift.
            card: "rgba(255, 255, 255, 0.04)",
        },

        interactive: {
            primary: {
                background: semanticColors.interactive.primary.background,
                text: semanticColors.interactive.primary.text,
                backgroundPressed:
                    semanticColors.interactive.primary.backgroundPressed,
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
