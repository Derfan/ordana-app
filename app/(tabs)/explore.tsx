import { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

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
            <View style={styles.centerContainer}>
                <Text variant="bodySemibold">❌ {error}</Text>
                <Text variant="link" color="link" onPress={refresh}>
                    Retry
                </Text>
            </View>
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
                            <Text color="muted">Loading analytics...</Text>
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
                                <Box
                                    radius={theme.radii.md}
                                    surface="elevated"
                                    paddingX="md"
                                    paddingY="md"
                                >
                                    <Text variant="subtitle">
                                        Expenses by Category
                                    </Text>

                                    <CategoryPieChart
                                        data={data.expensesByCategory}
                                    />
                                </Box>
                            ) : null}

                            {data.incomeByCategory.length > 0 ? (
                                <Box
                                    radius={theme.radii.md}
                                    surface="elevated"
                                    paddingX="md"
                                    paddingY="md"
                                >
                                    <Text variant="subtitle">
                                        Income by Category
                                    </Text>

                                    <CategoryPieChart
                                        data={data.incomeByCategory}
                                    />
                                </Box>
                            ) : null}
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
            marginHorizontal: theme.spacing[3],
        },
        centerContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 48,
        },
        statsContainer: {
            flexDirection: "row",
            columnGap: theme.spacing[2],
        },
    }),
);
