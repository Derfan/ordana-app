import { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';

interface BaseModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  isSubmitting?: boolean;
}

export function BaseModal({
  visible,
  title,
  onClose,
  children,
  isSubmitting = false,
}: BaseModalProps) {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <ThemedText type="title">{title}</ThemedText>
              <Pressable onPress={handleClose} disabled={isSubmitting}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </Pressable>
            </View>

            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
}

export const modalFormStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#000',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    lineHeight: 32,
  },
});
