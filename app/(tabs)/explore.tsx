import { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@components/themed-text";
import { ThemedView } from "@components/themed-view";
import { CategoryPieChart, MonthPicker } from "@features/analytics";
import { useMonthAnalytics } from "@hooks/use-analytics";
import { formatCurrency } from "@shared/utils/currency";
import { createThemedStyles, useTheme, Text, Box } from "@shared/design-system";

export default function AnalyticsScreen() {
    const now = new Date();
    const [year, setYear] = useState(now.getUTCFullYear());
    const [month, setMonth] = useState(now.getUTCMonth());

    const theme = useTheme();
    const styles = useStyles();

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
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refresh} />
            }
            removeClippedSubviews
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text variant="heading1">Analytics</Text>

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
                                <Box
                                    radius={theme.radii.md}
                                    surface="elevated"
                                    paddingX="md"
                                    paddingY="sm"
                                    flex={1}
                                >
                                    <Text variant="caption" color="muted">
                                        Income
                                    </Text>
                                    <Text variant="amount" color="success">
                                        {formatCurrency(data.stats.totalIncome)}
                                    </Text>
                                </Box>

                                <Box
                                    radius={theme.radii.md}
                                    surface="elevated"
                                    paddingX="md"
                                    paddingY="sm"
                                    flex={1}
                                >
                                    <Text variant="caption" color="muted">
                                        Expenses
                                    </Text>
                                    <Text variant="amount" color="danger">
                                        {formatCurrency(
                                            data.stats.totalExpense,
                                        )}
                                    </Text>
                                </Box>
                            </View>

                            <Box
                                radius={theme.radii.md}
                                surface="elevated"
                                paddingX="md"
                                paddingY="sm"
                                align="center"
                            >
                                <Text variant="caption" color="muted">
                                    Net Balance
                                </Text>
                                <Text
                                    variant="amountLarge"
                                    color={
                                        data.stats.balance > 0
                                            ? "success"
                                            : "danger"
                                    }
                                >
                                    {formatCurrency(data.stats.balance)}
                                </Text>
                                <Text variant="hint" color="muted">
                                    {data.stats.transactionCount} transactions
                                </Text>
                            </Box>

                            {data.expensesByCategory.length > 0 ? (
                                <Box radius={theme.radii.md} surface="elevated">
                                    <CategoryPieChart
                                        data={data.expensesByCategory}
                                        title="Expenses by Category"
                                    />
                                </Box>
                            ) : null}

                            {data.incomeByCategory.length > 0 ? (
                                <Box radius={theme.radii.md} surface="elevated">
                                    <CategoryPieChart
                                        data={data.incomeByCategory}
                                        title="Income by Category"
                                    />
                                </Box>
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
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        content: {
            flex: 1,
            rowGap: theme.spacing[2],
            marginHorizontal: theme.spacing[4],
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
        statsContainer: {
            flexDirection: "row",
            columnGap: theme.spacing[2],
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
    }),
);
