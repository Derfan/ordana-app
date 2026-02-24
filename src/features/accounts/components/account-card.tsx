import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import type { Account } from '@db/repositories';
import { formatCurrency } from '@utils/currency';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
}

export function AccountCard({ account, onPress, onLongPress, onDelete }: AccountCardProps) {
  const balance = account.balance || 0;
  const isNegative = balance < 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}>
      <ThemedView style={styles.content}>
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {account.name}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[
              styles.balance,
              isNegative && styles.balanceNegative,
            ]}>
            {formatCurrency(balance)}
          </ThemedText>
        </View>

        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ThemedText style={styles.deleteText}>✕</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  cardPressed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
  },
  balance: {
    fontSize: 20,
    fontWeight: '700',
  },
  balanceNegative: {
    color: '#dc2626',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
