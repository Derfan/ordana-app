import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { useAccounts } from "@hooks/use-accounts";
import { useLastNMonthsAnalytics } from "@hooks/use-analytics";
import { formatCurrency } from "@shared/utils/currency";
import { createThemedStyles, useTheme, Box, Text } from "@shared/design-system";

export const BalanceSummaryCard = () => {
    const [chartWidth, setChartWidth] = useState(0);

    const theme = useTheme();
    const styles = useStyles();

    const { totalBalance } = useAccounts();
    const { data: analytics } = useLastNMonthsAnalytics();

    const chartData = analytics.map((item) => {
        const profit = item.stats.totalIncome - item.stats.totalExpense;

        return {
            value: profit,
            label: item.label,
            frontColor:
                profit > 0
                    ? theme.colors.accent.success
                    : theme.colors.accent.danger,
        };
    });

    return (
        <Box
            radius={theme.radii.md}
            surface="elevated"
            align="flex-start"
            padding="md"
            gapY="sm"
        >
            <Text variant="caption" color="muted">
                Total Balance
            </Text>

            <Text variant="heading2">{formatCurrency(totalBalance)}</Text>

            <View
                style={styles.chart}
                onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
            >
                <BarChart
                    data={chartData}
                    xAxisLabelTextStyle={styles.chartAxis}
                    barBorderRadius={theme.radii.xs}
                    barWidth={chartWidth / chartData.length - 20}
                    width={chartWidth}
                    height={120}
                    initialSpacing={0}
                    endSpacing={0}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    hideYAxisText
                    disableScroll
                    disablePress
                    scrollToEnd
                    hideRules
                />
            </View>
        </Box>
    );
};

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        chart: {
            width: "100%",
        },
        chartAxis: {
            color: theme.colors.fg.muted,
        },
    }),
);
