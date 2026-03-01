/**
 * Design Token: Colors
 *
 * Three-layer architecture:
 *   1. palette   – raw hex values, named by hue + shade. No semantics, never used directly in components.
 *   2. semantic  – intent-based aliases that map palette values to meaning (brand, status, surface…).
 *   3. category  – fixed colors assigned to the default transaction categories (mirrors db/seed.ts).
 *
 * Rule: components import ONLY from `semantic` or `category`. Direct palette imports are
 * reserved for building new semantic tokens inside this file.
 */

// ─── 1. Palette ──────────────────────────────────────────────────────────────
// Source of truth for every raw color value in the app.
// Shades follow a 50-900 scale (lighter → darker), consistent with Tailwind CSS.

const palette = {
  // --- Brand (cyan-blue, maps to #0a7ea4 / tintColorLight) ---
  brand: {
    50: '#e6f4f9',
    100: '#cce9f3',
    200: '#99d3e7',
    300: '#66bcdb',
    400: '#33a6cf',
    500: '#0a7ea4', // primary brand — used on buttons, links, tint
    600: '#086d8e',
    700: '#065b78',
    800: '#044962',
    900: '#02384c',
  },

  // --- Neutral (cool grays, maps to text / icon / surface tokens) ---
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#ddd',      // border default
    400: '#9BA1A6',   // dark mode icon
    500: '#6b7280',   // muted text / icon light
    600: '#687076',   // icon light mode
    700: '#374151',
    800: '#11181C',   // primary text light
    850: '#151718',   // background dark
    900: '#ECEDEE',   // primary text dark
    950: '#000000',
  },

  // --- Red (danger / expense / destructive) ---
  red: {
    50: '#fee2e2',
    100: '#fecaca',
    300: '#fca5a5',
    500: '#ef4444',   // expense indicator / danger border
    600: '#dc2626',   // destructive action / negative balance
    700: '#b91c1c',
  },

  // --- Green (success / income) ---
  green: {
    50: '#d1fae5',
    100: '#a7f3d0',
    500: '#10b981',   // income indicator / success
    600: '#059669',   // freelance category
    700: '#047857',
  },

  // --- Teal ---
  teal: {
    400: '#2dd4bf',
    500: '#14b8a6',   // investments category
    600: '#0d9488',
  },

  // --- Cyan ---
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',   // entertainment / gifts category
    600: '#0891b2',
  },

  // --- Blue ---
  blue: {
    50: '#eff6ff',
    300: '#93c5fd',
    500: '#3b82f6',   // education category
    600: '#2563eb',
    // iOS system blue (used in account-card rgba tint)
    ios: '#007aff',
  },

  // --- Indigo ---
  indigo: {
    500: '#6366f1',   // communication category
    600: '#4f46e5',
  },

  // --- Violet / Purple ---
  violet: {
    500: '#8b5cf6',   // shopping category
    600: '#7c3aed',
  },

  // --- Purple ---
  purple: {
    500: '#a855f7',   // subscriptions category
    600: '#9333ea',
  },

  // --- Orange ---
  orange: {
    400: '#fb923c',
    500: '#f97316',   // housing category
    600: '#ea580c',
  },

  // --- Yellow ---
  yellow: {
    400: '#facc15',
    500: '#eab308',   // transportation category
    600: '#ca8a04',
  },

  // --- Emerald (used alongside green) ---
  emerald: {
    500: '#22c55e',   // healthcare category
    600: '#16a34a',
  },
} as const;

// ─── 2. Semantic tokens ───────────────────────────────────────────────────────
// These are the values components and themes consume. Organized by intent.

export const semanticColors = {
  // Brand
  brand: {
    default: palette.brand[500],
    subtle: palette.brand[100],
    strong: palette.brand[700],
  },

  // Status
  status: {
    income: palette.green[500],
    incomeSubtle: palette.green[50],
    incomeBorder: palette.green[500],

    expense: palette.red[500],
    expenseSubtle: palette.red[50],
    expenseBorder: palette.red[500],

    danger: palette.red[600],
    dangerSubtle: palette.red[50],

    success: palette.green[500],
    error: palette.red[600],
  },

  // Text
  text: {
    primary: {
      light: palette.neutral[800],  // #11181C
      dark: palette.neutral[900],   // #ECEDEE
    },
    muted: {
      light: palette.neutral[500],  // #6b7280
      dark: palette.neutral[400],   // #9BA1A6
    },
    subtle: {
      light: palette.neutral[600],  // #687076
      dark: palette.neutral[500],   // #6b7280 (hint/placeholder)
    },
    inverse: palette.neutral[0],
    link: palette.brand[500],
    placeholder: '#999999',
  },

  // Surface / Background
  surface: {
    primary: {
      light: palette.neutral[0],    // #fff
      dark: palette.neutral[850],   // #151718
    },
    subtle: {
      light: palette.neutral[50],   // #f9fafb
      dark: palette.neutral[850],
    },
    muted: palette.neutral[100],    // #f3f4f6
    overlay: 'rgba(0, 0, 0, 0.02)',
  },

  // Border
  border: {
    default: palette.neutral[300],  // #ddd
    muted: palette.neutral[200],
    brand: {
      subtle: `rgba(0, 122, 255, 0.10)`,  // account-card (iOS blue tint)
    },
  },

  // Icon
  icon: {
    default: {
      light: palette.neutral[600],  // #687076
      dark: palette.neutral[400],   // #9BA1A6
    },
    brand: palette.brand[500],
    close: '#666666',
  },

  // Interactive (buttons, controls)
  interactive: {
    primary: {
      background: palette.brand[500],
      text: palette.neutral[0],
      backgroundPressed: palette.brand[600],
    },
    destructive: {
      background: palette.red[600],
      text: palette.neutral[0],
    },
    ghost: {
      background: palette.neutral[100],
      border: 'transparent',
      text: palette.neutral[500],
    },
  },

  // Tab bar
  tab: {
    iconDefault: {
      light: palette.neutral[600],
      dark: palette.neutral[400],
    },
    iconSelected: {
      light: palette.brand[500],
      dark: palette.neutral[0],
    },
  },
} as const;

// ─── 3. Category colors ───────────────────────────────────────────────────────
// Fixed palette for system transaction categories (mirrors db/seed.ts).
// Stored as user-facing data in the DB — these values must stay stable.

export const categoryColors = {
  // Expense categories
  foodAndDining: palette.red[500],       // #ef4444
  housing: palette.orange[500],          // #f97316
  transportation: palette.yellow[500],   // #eab308
  healthcare: palette.emerald[500],      // #22c55e
  entertainment: palette.cyan[500],      // #06b6d4
  shopping: palette.violet[500],         // #8b5cf6
  education: palette.blue[500],          // #3b82f6
  communication: palette.indigo[500],    // #6366f1
  subscriptions: palette.purple[500],    // #a855f7
  other: palette.neutral[500],           // #6b7280

  // Income categories
  salary: palette.green[500],            // #10b981
  freelance: palette.green[600],         // #059669
  investments: palette.teal[500],        // #14b8a6
  gifts: palette.cyan[500],              // #06b6d4
  // otherIncome intentionally reuses `other`

  // Convenience: all category colors as an array (e.g. for a color picker)
  palette: [
    palette.red[500],
    palette.orange[500],
    palette.yellow[500],
    palette.emerald[500],
    palette.cyan[500],
    palette.violet[500],
    palette.blue[500],
    palette.indigo[500],
    palette.purple[500],
    palette.neutral[500],
    palette.green[500],
    palette.green[600],
    palette.teal[500],
  ],
} as const;

// ─── Re-export palette for internal token use only ────────────────────────────
// Intentionally NOT part of the public design-system barrel.
// If you need to add a new semantic token, extend semanticColors above.
export { palette as _palette };
