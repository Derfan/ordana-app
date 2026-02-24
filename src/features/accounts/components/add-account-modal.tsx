import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@components/themed-text';
import { BaseModal, modalFormStyles } from '@components/ui/base-modal';
import type { NewAccount } from '@db/repositories';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: NewAccount) => Promise<void>;
}

const ACCOUNT_TYPES = [
  { label: 'Card', icon: '💳' },
  { label: 'Cash', icon: '💵' },
  { label: 'Savings', icon: '🏦' },
  { label: 'Credit', icon: '💰' },
];

export function AddAccountModal({ visible, onClose, onSubmit }: AddAccountModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState(0);

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName('');
    setBalance('0');
    setSelectedType(0);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    const parsedBalance = parseFloat(balance) || 0;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        balance: Math.round(parsedBalance * 100),
      });
      
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create account'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBalanceChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.-]/g, '');
    setBalance(cleaned);
  };

  const handleTypeSelect = (index: number) => {
    setSelectedType(index);
    if (!name.trim()) {
      setName(ACCOUNT_TYPES[index].label);
    }
  };

  return (
    <BaseModal
      visible={visible}
      title="New Account"
      onClose={handleClose}
      isSubmitting={isSubmitting}
    >
      <View style={modalFormStyles.section}>
        <ThemedText type="defaultSemiBold" style={modalFormStyles.label}>
          Account Type
        </ThemedText>
        <View style={styles.typeGrid}>
          {ACCOUNT_TYPES.map((type, index) => (
            <Pressable
              key={index}
              onPress={() => handleTypeSelect(index)}
              style={[
                styles.typeButton,
                selectedType === index && styles.typeButtonActive,
              ]}>
              <ThemedText style={styles.typeIcon}>{type.icon}</ThemedText>
              <ThemedText
                style={[
                  styles.typeLabel,
                  selectedType === index && styles.typeLabelActive,
                ]}>
                {type.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={modalFormStyles.section}>
        <ThemedText type="defaultSemiBold" style={modalFormStyles.label}>
          Name *
        </ThemedText>
        <TextInput
          style={modalFormStyles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Main Card"
          placeholderTextColor="#999"
          maxLength={100}
          autoFocus
          editable={!isSubmitting}
        />
        <ThemedText style={modalFormStyles.hint}>
          {name.length}/100 characters
        </ThemedText>
      </View>

      <View style={modalFormStyles.section}>
        <ThemedText type="defaultSemiBold" style={modalFormStyles.label}>
          Initial Balance
        </ThemedText>
        <View style={styles.balanceInput}>
          <TextInput
            style={modalFormStyles.input}
            value={balance}
            onChangeText={handleBalanceChange}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!isSubmitting}
          />
          <ThemedText style={styles.currency}>€</ThemedText>
        </View>
        <ThemedText style={modalFormStyles.hint}>
          Enter the current account balance
        </ThemedText>
      </View>
      
      <Pressable
        style={[
          styles.button,
          styles.buttonSubmit,
          isSubmitting && styles.buttonDisabled,
        ]}
        disabled={isSubmitting}
        onPress={handleSubmit}
      >
        <ThemedText style={styles.buttonSubmitText}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </ThemedText>
      </Pressable>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  typeButtonActive: {
    borderColor: '#0a7ea4',
    backgroundColor: '#e6f4f9',
  },
  typeIcon: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
  },
  typeLabelActive: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  balanceInput: {
    position: 'relative',
  },
  currency: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonSubmit: {
    backgroundColor: '#007AFF',
  },
  buttonSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
