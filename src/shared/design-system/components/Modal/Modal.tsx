import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../hooks/use-theme';
import { Text } from '../Text/Text';
import { View } from '../View/View';

export interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /**
   * When true, the close button is disabled and onClose is suppressed.
   * Use during async operations to prevent accidental dismissal.
   */
  isSubmitting?: boolean;
}

export function Modal({
  visible,
  title,
  onClose,
  children,
  isSubmitting = false,
}: ModalProps) {
  const theme = useTheme();

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View surface="primary" style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingVertical: theme.spacing[10],
                paddingHorizontal: theme.spacing[5],
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View surface="primary" style={[styles.header, { marginBottom: theme.spacing[8] }]}>
              <Text variant="heading1">{title}</Text>

              <Pressable
                onPress={handleClose}
                disabled={isSubmitting}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => pressed && styles.closeButtonPressed}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <Text
                  variant="body"
                  colorValue={theme.colors.icon.close}
                  style={styles.closeButtonText}
                >
                  ✕
                </Text>
              </Pressable>
            </View>

            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}

/**
 * Shared form styles for modal form content.
 *
 * Exported as a plain object (not StyleSheet.create) so consuming
 * feature components can merge theme-resolved values at runtime:
 *
 *   <View style={[modalFormSection(theme)]} />
 *
 * Static layout properties that don't depend on the theme are in
 * `staticModalFormStyles` below for tree-shaking friendliness.
 */
export const useModalFormStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    section: {
      marginBottom: theme.spacing[6],
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.radii.sm,
      padding: theme.spacing[3],
      ...theme.typography.body,
      backgroundColor: theme.colors.surface.primary,
      color: theme.colors.text.primary,
    },
    hint: {
      ...theme.typography.hint,
      color: theme.colors.text.subtle,
      marginTop: theme.spacing[1],
    },
    typeButtons: {
      flexDirection: 'row' as const,
      gap: theme.spacing[3],
    },
    typeButton: {
      flex: 1,
      padding: theme.spacing[3],
      borderRadius: theme.radii.sm,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.surface.muted,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeButtonActiveExpense: {
      backgroundColor: theme.colors.status.expenseSubtle,
      borderColor: theme.colors.status.expenseBorder,
    },
    typeButtonActiveIncome: {
      backgroundColor: theme.colors.status.incomeSubtle,
      borderColor: theme.colors.status.incomeBorder,
    },
    typeButtonText: {
      ...theme.typography.labelSmall,
      color: theme.colors.text.muted,
    },
    typeButtonTextActive: {
      color: theme.colors.text.primary,
    },
    emptyText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text.muted,
      fontStyle: 'italic' as const,
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    lineHeight: 32,
  },
  closeButtonPressed: {
    opacity: 0.5,
  },
});
