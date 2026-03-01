import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@components/themed-text";
import { AddTransactionModal } from "@features/transactions";
import { useAccounts } from "@hooks/use-accounts";
import { useCurrentMonthAnalytics } from "@hooks/use-analytics";
import { useThemeColor } from "@hooks/use-theme-color";
import { useRecentTransactions } from "@hooks/use-transactions";
import { useTransactionsStore } from "@store/transactions-store";
import { formatCurrency } from "@shared/utils/currency";
import { formatDate } from "@shared/utils/date";

export default function HomeScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const { totalBalance } = useAccounts();
    const { transactions, isLoading } = useRecentTransactions(5);
    const { data: analytics } = useCurrentMonthAnalytics();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddTransaction = async (data: any) => {
        await useTransactionsStore.getState().addTransaction(data);
    };

    const currentMonth = new Date().toLocaleDateString("en-US", {
        month: "short",
    });

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor }]}
            edges={["top", "left", "right"]}
        >
            <View style={styles.balanceCard}>
                <ThemedText style={styles.balanceLabel}>
                    Total Balance
                </ThemedText>
                <ThemedText style={styles.balanceAmount}>
                    {formatCurrency(totalBalance)}
                </ThemedText>
                <Pressable
                    style={styles.addButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <ThemedText style={styles.addButtonText}>
                        + Add Transaction
                    </ThemedText>
                </Pressable>
            </View>

            {analytics && (
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, styles.incomeCard]}>
                        <ThemedText style={styles.statLabel}>
                            Income ({currentMonth})
                        </ThemedText>
                        <ThemedText style={styles.statAmount}>
                            {formatCurrency(analytics.stats.totalIncome)}
                        </ThemedText>
                    </View>

                    <View style={[styles.statCard, styles.expenseCard]}>
                        <ThemedText style={styles.statLabel}>
                            Expenses ({currentMonth})
                        </ThemedText>
                        <ThemedText style={styles.statAmount}>
                            {formatCurrency(analytics.stats.totalExpense)}
                        </ThemedText>
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Recent Transactions
                </ThemedText>
                {isLoading ? (
                    <ThemedText style={styles.loadingText}>
                        Loading...
                    </ThemedText>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <ThemedText style={styles.emptyIcon}>💸</ThemedText>
                        <ThemedText style={styles.emptyText}>
                            No transactions yet
                        </ThemedText>
                    </View>
                ) : (
                    <View style={styles.transactionsList}>
                        {transactions.map((txn) => {
                            const isIncome = txn.type === "income";
                            const sign = isIncome ? "+" : "-";
                            const amountColor = isIncome
                                ? "#10b981"
                                : "#ef4444";

                            return (
                                <View
                                    key={txn.id}
                                    style={styles.transactionItem}
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
                                            <ThemedText style={styles.icon}>
                                                {txn.category.icon}
                                            </ThemedText>
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <ThemedText
                                                style={styles.categoryName}
                                            >
                                                {txn.category.name}
                                            </ThemedText>
                                            <ThemedText
                                                style={styles.transactionDate}
                                            >
                                                {formatDate(txn.date)}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <ThemedText
                                        style={[
                                            styles.transactionAmount,
                                            { color: amountColor },
                                        ]}
                                    >
                                        {sign}
                                        {formatCurrency(txn.amount)}
                                    </ThemedText>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            <AddTransactionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddTransaction}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    balanceCard: {
        backgroundColor: "#007AFF",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: "center",
    },
    balanceLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "700",
        marginBottom: 16,
        lineHeight: 44,
    },
    addButton: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        gap: 4,
    },
    incomeCard: {
        backgroundColor: "#10b981",
    },
    expenseCard: {
        backgroundColor: "#ef4444",
    },
    statLabel: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 11,
        fontWeight: "500",
    },
    statAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    section: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
    loadingText: {
        opacity: 0.6,
        textAlign: "center",
        marginTop: 20,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 12,
        lineHeight: 72,
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.6,
    },
    transactionsList: {
        gap: 12,
    },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        padding: 12,
        borderRadius: 12,
    },
    transactionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 20,
    },
    transactionInfo: {
        gap: 2,
        flex: 1,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: "600",
    },
    transactionDate: {
        fontSize: 12,
        opacity: 0.6,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: "700",
    },
});
