import { Pressable, StyleSheet } from "react-native";

import {
    Text,
    View,
    createThemedStyles,
    useTheme,
} from "@shared/design-system";
import type { TransactionWithDetails } from "@db/repositories";
import { formatCurrency } from "@shared/utils/currency";
import { formatDate } from "@shared/utils/date";

interface TransactionCardProps {
    transaction: TransactionWithDetails;
    onPress?: () => void;
    onLongPress?: () => void;
}

export function TransactionCard({
    transaction,
    onPress,
    onLongPress,
}: TransactionCardProps) {
    const styles = useStyles();
    const theme = useTheme();

    const isIncome = transaction.type === "income";
    const sign = isIncome ? "+" : "-";
    const amountColor = isIncome
        ? theme.colors.fg.positive
        : theme.colors.fg.negative;

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${transaction.category.name}, ${sign}${formatCurrency(transaction.amount)}`}
        >
            <View style={styles.content}>
                {/* Category icon with color badge */}
                <View
                    colorValue={`${transaction.category.color}20`}
                    style={styles.iconContainer}
                >
                    <Text style={styles.icon}>{transaction.category.icon}</Text>
                    <View
                        colorValue={transaction.category.color}
                        style={styles.colorIndicator}
                    />
                </View>

                {/* Transaction info */}
                <View colorValue="transparent" style={styles.info}>
                    <Text variant="bodySemibold">
                        {transaction.category.name}
                    </Text>
                    <View colorValue="transparent" style={styles.details}>
                        <Text variant="caption" color="muted">
                            {transaction.account.name}
                        </Text>
                        {transaction.description && (
                            <>
                                <Text variant="caption" color="subtle">
                                    •
                                </Text>
                                <Text
                                    variant="caption"
                                    color="muted"
                                    numberOfLines={1}
                                >
                                    {transaction.description}
                                </Text>
                            </>
                        )}
                    </View>
                    <Text variant="hint" color="subtle">
                        {formatDate(transaction.date)}
                    </Text>
                </View>

                {/* Amount */}
                <Text style={[styles.amount, { color: amountColor }]}>
                    {sign}
                    {formatCurrency(transaction.amount)}
                </Text>
            </View>
        </Pressable>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        card: {
            borderRadius: theme.radii.md,
        },
        cardPressed: {
            opacity: 0.7,
        },
        content: {
            flexDirection: "row",
            alignItems: "center",
            padding: theme.spacing[4],
            gap: theme.spacing[3],
            backgroundColor: theme.colors.bg.sunken,
            borderRadius: theme.radii.md,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: theme.radii.iconCircle,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
        },
        icon: {
            fontSize: 24,
            lineHeight: 28,
        },
        colorIndicator: {
            position: "absolute",
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
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[1],
            flexWrap: "wrap",
        },
        amount: {
            ...theme.typography.amount,
            minWidth: 80,
            textAlign: "right",
        },
    }),
);
