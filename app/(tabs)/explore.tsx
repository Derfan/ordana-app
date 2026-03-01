import { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@components/themed-text";
import { ThemedView } from "@components/themed-view";
import { CategoryPieChart, MonthPicker } from "@features/analytics";
import { useMonthAnalytics } from "@hooks/use-analytics";
import { useThemeColor } from "@hooks/use-theme-color";
import { formatCurrency } from "@shared/utils/currency";

export default function AnalyticsScreen() {
    const backgroundColor = useThemeColor({}, "background");

    const now = new Date();
    const [year, setYear] = useState(now.getUTCFullYear());
    const [month, setMonth] = useState(now.getUTCMonth());

    const { data, isLoading, error, refresh } = useMonthAnalytics(year, month);

    const handleMonthChange = (nextYear: number, nextMonth: number) => {
        setYear(nextYear);
        setMonth(nextMonth);
    };

    if (error) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
                <ThemedText onPress={refresh} style={styles.retryText}>
                    Retry
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor }]}
            edges={["top", "left", "right"]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refresh}
                    />
                }
            >
                <View style={styles.header}>
                    <ThemedText type="title">Analytics</ThemedText>
                </View>

                <MonthPicker
                    year={year}
                    month={month}
                    onChange={handleMonthChange}
                    maxDate={now}
                />

                {isLoading || !data ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#0a7ea4" />
                        <ThemedText style={styles.loadingText}>
                            Loading analytics...
                        </ThemedText>
                    </View>
                ) : (
                    <>
                        <View style={styles.statsContainer}>
                            <View style={[styles.statCard, styles.incomeCard]}>
                                <ThemedText style={styles.statLabel}>
                                    Income
                                </ThemedText>
                                <ThemedText style={styles.statAmount}>
                                    {formatCurrency(data.stats.totalIncome)}
                                </ThemedText>
                            </View>

                            <View style={[styles.statCard, styles.expenseCard]}>
                                <ThemedText style={styles.statLabel}>
                                    Expenses
                                </ThemedText>
                                <ThemedText style={styles.statAmount}>
                                    {formatCurrency(data.stats.totalExpense)}
                                </ThemedText>
                            </View>
                        </View>

                        <View style={[styles.statCard, styles.balanceCard]}>
                            <ThemedText style={styles.statLabel}>
                                Net Balance
                            </ThemedText>
                            <ThemedText
                                style={[
                                    styles.statAmount,
                                    styles.balanceLarge,
                                    data.stats.balance < 0 &&
                                        styles.balanceNegative,
                                ]}
                            >
                                {formatCurrency(data.stats.balance)}
                            </ThemedText>
                            <ThemedText style={styles.transactionCount}>
                                {data.stats.transactionCount} transactions
                            </ThemedText>
                        </View>

                        {data.expensesByCategory.length > 0 ? (
                            <View style={styles.chartSection}>
                                <CategoryPieChart
                                    data={data.expensesByCategory}
                                    title="Expenses by Category"
                                />
                            </View>
                        ) : null}

                        {data.incomeByCategory.length > 0 ? (
                            <View style={styles.chartSection}>
                                <CategoryPieChart
                                    data={data.incomeByCategory}
                                    title="Income by Category"
                                />
                            </View>
                        ) : null}

                        {data.expensesByCategory.length === 0 &&
                            data.incomeByCategory.length === 0 && (
                                <View style={styles.emptyState}>
                                    <ThemedText style={styles.emptyIcon}>
                                        📊
                                    </ThemedText>
                                    <ThemedText style={styles.emptyText}>
                                        No transactions for this month
                                    </ThemedText>
                                </View>
                            )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 48,
    },
    loadingText: {
        marginTop: 12,
        opacity: 0.6,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },
    retryText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        marginBottom: 8,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
        marginTop: 20,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    incomeCard: {
        backgroundColor: "#10b981",
    },
    expenseCard: {
        backgroundColor: "#ef4444",
    },
    balanceCard: {
        backgroundColor: "#007AFF",
        alignItems: "center",
        marginBottom: 24,
    },
    statLabel: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 13,
        fontWeight: "500",
    },
    statAmount: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    balanceLarge: {
        fontSize: 28,
        lineHeight: 36,
    },
    balanceNegative: {
        color: "#fca5a5",
    },
    transactionCount: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        marginTop: 4,
    },
    chartSection: {
        marginBottom: 24,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 48,
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
});
