import type { ReactNode } from 'react';
import { StyleSheet, View as RNView } from 'react-native';

import { createThemedStyles } from '../../hooks/create-themed-styles';
import { Text } from '../Text/Text';

export interface FormFieldProps {
  label: string;
  /** The input element — TextInput, picker, etc. */
  children: ReactNode;
  /** Validation error message. When present, shown in error color. */
  error?: string;
  /** Secondary hint shown when there is no error. */
  hint?: string;
  /** Whether the field is required — appends " *" to the label. */
  required?: boolean;
}

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    root: {
      marginBottom: theme.spacing[6],
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.fg.default,
      marginBottom: theme.spacing[2],
    },
    error: {
      ...theme.typography.hint,
      color: theme.colors.fg.danger,
      marginTop: theme.spacing[1],
    },
    hint: {
      ...theme.typography.hint,
      color: theme.colors.fg.subtle,
      marginTop: theme.spacing[1],
    },
  }),
);

export function FormField({ label, children, error, hint, required = false }: FormFieldProps) {
  const styles = useStyles();

  return (
    <RNView style={styles.root}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>

      {children}

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </RNView>
  );
}
