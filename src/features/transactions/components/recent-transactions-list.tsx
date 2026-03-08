import { StyleSheet, View } from "react-native";

import { useRecentTransactions } from "@hooks/use-transactions";
import { formatCurrency } from "@shared/utils/currency";
import { formatDate } from "@shared/utils/date";
import { createThemedStyles, useTheme, Box, Text } from "@shared/design-system";

export const RecentTransactionsList = () => {
    const theme = useTheme();
    const styles = useStyles();

    const { transactions, isLoading } = useRecentTransactions(5);

    if (isLoading) {
        return <Text color="muted">Loading...</Text>;
    }

    if (transactions.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💸</Text>
                <Text color="muted">No transactions yet</Text>
            </View>
        );
    }

    return (
        <Box radius={theme.radii.md} surface="elevated" paddingX="md">
            {transactions.map((txn) => {
                const isIncome = txn.type === "income";

                return (
                    <>
                        <Box
                            key={txn.id}
                            direction="row"
                            align="center"
                            paddingY="md"
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
                                variant="bodySemibold"
                                color={isIncome ? "success" : "danger"}
                            >
                                {isIncome ? "+" : "-"}
                                {formatCurrency(txn.amount)}
                            </Text>
                        </Box>
                    </>
                );
            })}
        </Box>
    );
};

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
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
            width: 32,
            height: 32,
        },
    }),
);
