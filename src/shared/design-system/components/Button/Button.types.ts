import type { PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'destructive' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /**
   * Visual style of the button.
   * - `primary`     — brand-colored fill (default)
   * - `destructive` — red fill, used for delete / irreversible actions
   * - `ghost`       — muted background, no prominent border; used for secondary actions
   */
  variant?: ButtonVariant;

  /**
   * Size controls padding and font size.
   * - `sm` — compact, used inline or in tight layouts
   * - `md` — default size
   * - `lg` — prominent CTAs (e.g. form submit buttons)
   */
  size?: ButtonSize;

  /** Button label text. */
  label: string;

  /**
   * When true the button renders in a visually muted state and
   * `onPress` is suppressed. Mirrors the native `disabled` prop
   * but also applies design-system opacity.
   */
  disabled?: boolean;

  /**
   * Shows a loading indicator in place of the label and suppresses `onPress`.
   * The button retains its dimensions while loading to avoid layout shift.
   */
  loading?: boolean;

  /**
   * Optional icon rendered to the left of the label.
   * Accepts any renderable React node — typically an <Icon /> primitive.
   */
  leftIcon?: React.ReactNode;

  /**
   * Optional icon rendered to the right of the label.
   */
  rightIcon?: React.ReactNode;
}
