import { Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import type { CategorySpending } from '@db/repositories';
import { useColorScheme } from '@hooks/use-color-scheme';
import { formatCurrency } from '@utils/currency';

interface CategoryPieChartProps {
  data: CategorySpending[];
  title: string;
}

export function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (data.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyIcon}>📊</ThemedText>
        <ThemedText style={styles.emptyText}>No data for this period</ThemedText>
      </ThemedView>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    amount: item.totalAmount / 100, // Convert from cents to major units
    color: item.categoryColor,
    legendFontColor: isDark ? '#fff' : '#000',
    legendFontSize: 12,
  }));

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; // padding

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      <PieChart
        data={chartData}
        width={chartWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.categoryId} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.categoryColor }]} />
              <ThemedText style={styles.categoryIcon}>{item.categoryIcon}</ThemedText>
              <ThemedText style={styles.categoryName}>{item.categoryName}</ThemedText>
            </View>
            <View style={styles.legendRight}>
              <ThemedText style={styles.amount}>{formatCurrency(item.totalAmount)}</ThemedText>
              <ThemedText style={styles.percentage}>
                {(item.percentage * 100).toFixed(1)}%
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  legend: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  legendRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
