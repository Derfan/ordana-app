import type { Account } from '@db/repositories';
import { createThemedStyles, Text, useTheme, View } from '@shared/design-system';
import { formatCurrency } from '@shared/utils/currency';
import { Pressable, StyleSheet } from 'react-native';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
}

export function AccountCard({ account, onPress, onLongPress, onDelete }: AccountCardProps) {
  const styles = useStyles();
  const theme = useTheme();

  const balance = account.balance || 0;
  const isNegative = balance < 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <View colorValue="transparent" style={styles.info}>
          <Text variant="bodySemibold">{account.name}</Text>
          <Text
            variant="amountLarge"
            colorValue={isNegative ? theme.colors.fg.danger : theme.colors.fg.default}
          >
            {formatCurrency(balance)}
          </Text>
        </View>

        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${account.name}`}
          >
            <Text variant="bodySemibold" colorValue="#fff">
              ✕
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    card: {
      borderRadius: theme.radii.md,
      overflow: 'hidden',
      marginBottom: theme.spacing[3],
      backgroundColor: 'transparent',
    },
    cardPressed: {
      opacity: 0.7,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing[4],
      backgroundColor: theme.colors.overlay.card,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
    },
    info: {
      flex: 1,
      gap: theme.spacing[1],
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: theme.radii.circle,
      backgroundColor: theme.colors.accent.danger,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing[3],
    },
    deleteButtonPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },
  }),
);
