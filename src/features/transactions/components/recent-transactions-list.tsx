import { StyleSheet, View } from "react-native";

import { useRecentTransactions } from "@hooks/use-transactions";
import { formatCurrency } from "@shared/utils/currency";
import { formatDate } from "@shared/utils/date";
import { createThemedStyles, useTheme, Box, Text } from "@shared/design-system";

export const RecentTransactionsList = () => {
    const theme = useTheme();
    const styles = useStyles();

    const { transactions, isLoading: transactionsLoading } =
        useRecentTransactions(5);

    return (
        <View style={styles.section}>
            <Text variant="subtitle">Recent Transactions</Text>
            {transactionsLoading ? (
                <Text color="muted">Loading...</Text>
            ) : transactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>💸</Text>
                    <Text color="muted">No transactions yet</Text>
                </View>
            ) : (
                <Box radius={theme.radii.md} surface="elevated">
                    {transactions.map((txn) => {
                        const isIncome = txn.type === "income";

                        return (
                            <Box
                                key={txn.id}
                                direction="row"
                                align="center"
                                paddingX="md"
                                paddingY="sm"
                            >
                                <View style={styles.transactionLeft}>
                                    <View
                                        style={[
                                            styles.categoryIcon,
                                            {
                                                backgroundColor: `${txn.category.color}20`,
                                            },
                                        ]}
                                    >
                                        <Text>{txn.category.icon}</Text>
                                    </View>
                                    <View>
                                        <Text variant="bodySemibold">
                                            {txn.category.name}
                                        </Text>
                                        <Text variant="hint" color="muted">
                                            {formatDate(txn.date)}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    variant="amount"
                                    color={isIncome ? "success" : "danger"}
                                >
                                    {isIncome ? "+" : "-"}
                                    {formatCurrency(txn.amount)}
                                </Text>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </View>
    );
};

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        section: {
            rowGap: theme.spacing[2],
        },
        emptyState: {
            alignItems: "center",
            paddingVertical: theme.spacing[10],
            rowGap: theme.spacing[2],
        },
        emptyIcon: {
            fontSize: 60,
            lineHeight: 72,
        },
        transactionLeft: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            columnGap: theme.spacing[3],
        },
        categoryIcon: {
            borderRadius: theme.radii.full,
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
        },
    }),
);
