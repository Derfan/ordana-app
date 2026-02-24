import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import type { TransactionWithDetails } from '@db/repositories';
import { formatCurrency } from '@utils/currency';
import { formatDate } from '@utils/date';

interface TransactionCardProps {
  transaction: TransactionWithDetails;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TransactionCard({ transaction, onPress, onLongPress }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  const sign = isIncome ? '+' : '-';
  const amountColor = isIncome ? '#10b981' : '#ef4444';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <ThemedView style={styles.content}>
        {/* Category Icon with color indicator */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${transaction.category.color}20` },
          ]}>
          <ThemedText style={styles.icon}>{transaction.category.icon}</ThemedText>
          <View
            style={[
              styles.colorIndicator,
              { backgroundColor: transaction.category.color },
            ]}
          />
        </View>

        {/* Transaction Info */}
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={styles.categoryName}>
            {transaction.category.name}
          </ThemedText>
          <View style={styles.details}>
            <ThemedText style={styles.accountName}>{transaction.account.name}</ThemedText>
            {transaction.description && (
              <>
                <ThemedText style={styles.separator}>•</ThemedText>
                <ThemedText style={styles.description} numberOfLines={1}>
                  {transaction.description}
                </ThemedText>
              </>
            )}
          </View>
          <ThemedText style={styles.date}>{formatDate(transaction.date)}</ThemedText>
        </View>

        {/* Amount */}
        <ThemedText type="defaultSemiBold" style={[styles.amount, { color: amountColor }]}>
          {sign}
          {formatCurrency(transaction.amount)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 24,
  },
  colorIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  categoryName: {
    fontSize: 16,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  accountName: {
    fontSize: 13,
    opacity: 0.6,
  },
  separator: {
    fontSize: 13,
    opacity: 0.4,
  },
  description: {
    fontSize: 13,
    opacity: 0.6,
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },
});
