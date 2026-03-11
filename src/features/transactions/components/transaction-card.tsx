import type { TransactionWithDetails } from '@db/repositories';
import { Box, createThemedStyles, Text, useTheme, View } from '@shared/design-system';
import { formatCurrency } from '@shared/utils/currency';
import { formatDate } from '@shared/utils/date';
import { Pressable, StyleSheet } from 'react-native';

interface TransactionCardProps {
  transaction: TransactionWithDetails;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function TransactionCard({ transaction, onPress, onLongPress }: TransactionCardProps) {
  const styles = useStyles();
  const theme = useTheme();

  const isIncome = transaction.type === 'income';
  const sign = isIncome ? '+' : '-';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => pressed && styles.cardPressed}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.category.name}, ${sign}${formatCurrency(transaction.amount)}`}
    >
      <Box
        radius={theme.radii.md}
        direction="row"
        align="center"
        surface="elevated"
        padding="sm"
        gapX="sm"
      >
        {/* Category icon with color badge */}
        <View colorValue={`${transaction.category.color}20`} style={styles.iconContainer}>
          <Text style={styles.icon}>{transaction.category.icon}</Text>
          <View colorValue={transaction.category.color} style={styles.colorIndicator} />
        </View>

        {/* Transaction info */}
        <View colorValue="transparent" style={styles.info}>
          <Text variant="bodySemibold">{transaction.category.name}</Text>
          <View colorValue="transparent" style={styles.details}>
            <Text variant="caption" color="muted">
              {transaction.account.name}
            </Text>

            {transaction.description && (
              <>
                <Text variant="caption" color="subtle">
                  •
                </Text>
                <Text variant="caption" color="muted" numberOfLines={1}>
                  {transaction.description}
                </Text>
              </>
            )}
          </View>

          <Text variant="hint" color="subtle">
            {formatDate(transaction.date)}
          </Text>
        </View>

        <Text variant="amount" color={isIncome ? 'success' : 'negative'}>
          {sign}
          {formatCurrency(transaction.amount)}
        </Text>
      </Box>
    </Pressable>
  );
}

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    cardPressed: {
      opacity: 0.7,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.radii.iconCircle,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    icon: {
      fontSize: 24,
      lineHeight: 28,
    },
    colorIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: theme.radii.dot,
      borderWidth: 2,
      borderColor: theme.colors.bg.page,
    },
    info: {
      flex: 1,
      gap: theme.spacing[0.5],
    },
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
      flexWrap: 'wrap',
    },
  }),
);
