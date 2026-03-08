import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import type { CategorySpending } from "@db/repositories";
import { formatCurrency } from "@shared/utils/currency";
import { useTheme, Box, Text } from "@shared/design-system";

interface CategoryPieChartProps {
    data: CategorySpending[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    const theme = useTheme();

    const chartData = useChartData(data);

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text color="muted">No data for this period</Text>
            </View>
        );
    }

    return (
        <>
            <View style={styles.chartContainer}>
                <PieChart
                    data={chartData}
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={theme.colors.bg.elevated}
                    centerLabelComponent={(activeIdx: number) => {
                        const { label, percentage } =
                            chartData[activeIdx] ?? {};

                        return (
                            <Box align="center" gapY="sm">
                                <Text variant="amount">{percentage}</Text>
                                <Text variant="hint" color="muted">
                                    {label}
                                </Text>
                            </Box>
                        );
                    }}
                    focusOnPress
                />
            </View>

            <View style={styles.legend}>
                {data.map((item) => (
                    <View key={item.categoryId} style={styles.legendItem}>
                        <View style={styles.legendLeft}>
                            <View
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: item.categoryColor },
                                ]}
                            />
                            <Text>{item.categoryIcon}</Text>
                            <Text variant="bodySemibold">
                                {item.categoryName}
                            </Text>
                        </View>
                        <View style={styles.legendRight}>
                            <Text variant="amount">
                                {formatCurrency(item.totalAmount)}
                            </Text>
                            <Text variant="hint" color="muted">
                                {(item.percentage * 100).toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
}

const useChartData = (data: CategorySpending[]) => {
    return data.map((item, idx) => ({
        color: item.categoryColor,
        value: item.totalAmount,
        label: item.categoryName,
        percentage: `${(item.percentage * 100).toFixed(1)}%`,
        focused: idx === 0,
    }));
};

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    legend: {
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    legendLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendRight: {
        alignItems: "flex-end",
        gap: 2,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        rowGap: 12,
    },
    emptyIcon: {
        fontSize: 40,
        lineHeight: 40,
    },
});
