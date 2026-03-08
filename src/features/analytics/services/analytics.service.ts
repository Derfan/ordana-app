import { transactionRepository, type CategorySpending } from "@db/repositories";

export interface MonthAnalytics {
    /** Zero-based month index (0 = January). */
    month: number;
    year: number;
    /** Short label for chart axes, e.g. "Jan", "Feb". */
    label: string;
    stats: MonthlyStats;
    expensesByCategory: CategorySpending[];
    incomeByCategory: CategorySpending[];
}

export interface MonthlyStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}

export interface AnalyticsData {
    stats: MonthlyStats;
    expensesByCategory: CategorySpending[];
    incomeByCategory: CategorySpending[];
}

/**
 * Service Layer for analytics
 * Provides data aggregation and calculations
 */
export class AnalyticsService {
    /**
     * Get start and end dates for the current month
     */
    private getCurrentMonthRange(): { startDate: Date; endDate: Date } {
        const now = new Date();
        const startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
            0,
        );
        const endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
        );

        return { startDate, endDate };
    }

    /**
     * Get analytics data for current month
     */
    async getCurrentMonthAnalytics(): Promise<AnalyticsData> {
        try {
            const { startDate, endDate } = this.getCurrentMonthRange();

            // Get all transactions for the month
            const allTransactions = await transactionRepository.getByDateRange(
                startDate,
                endDate,
            );

            // Calculate stats
            const totalIncome = allTransactions
                .filter((txn) => txn.type === "income")
                .reduce((sum, txn) => sum + txn.amount, 0);

            const totalExpense = allTransactions
                .filter((txn) => txn.type === "expense")
                .reduce((sum, txn) => sum + txn.amount, 0);

            const stats: MonthlyStats = {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                transactionCount: allTransactions.length,
            };

            // Get spending by category
            const expensesByCategory =
                await transactionRepository.getCategorySpending(
                    startDate,
                    endDate,
                    "expense",
                );

            const incomeByCategory =
                await transactionRepository.getCategorySpending(
                    startDate,
                    endDate,
                    "income",
                );

            return {
                stats,
                expensesByCategory,
                incomeByCategory,
            };
        } catch (error) {
            console.error(
                "[AnalyticsService] Error getting current month analytics:",
                error,
            );
            throw new Error("Failed to load analytics data");
        }
    }

    /**
     * Get analytics for a specific month
     */
    async getMonthAnalytics(
        year: number,
        month: number,
    ): Promise<AnalyticsData> {
        try {
            const startDate = new Date(year, month, 1, 0, 0, 0, 0);
            const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

            // Get all transactions for the month
            const allTransactions = await transactionRepository.getByDateRange(
                startDate,
                endDate,
            );

            // Calculate stats
            const totalIncome = allTransactions
                .filter((txn) => txn.type === "income")
                .reduce((sum, txn) => sum + txn.amount, 0);

            const totalExpense = allTransactions
                .filter((txn) => txn.type === "expense")
                .reduce((sum, txn) => sum + txn.amount, 0);

            const stats: MonthlyStats = {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                transactionCount: allTransactions.length,
            };

            // Get spending by category
            const expensesByCategory =
                await transactionRepository.getCategorySpending(
                    startDate,
                    endDate,
                    "expense",
                );

            const incomeByCategory =
                await transactionRepository.getCategorySpending(
                    startDate,
                    endDate,
                    "income",
                );

            return {
                stats,
                expensesByCategory,
                incomeByCategory,
            };
        } catch (error) {
            console.error(
                "[AnalyticsService] Error getting month analytics:",
                error,
            );
            throw new Error("Failed to load analytics data");
        }
    }

    /**
     * Returns analytics for each of the last N months (default 6),
     * ordered oldest → newest so the array maps directly to a chart's X axis.
     */
    async getLastNMonthsAnalytics(n: number = 6): Promise<MonthAnalytics[]> {
        const now = new Date();

        const months: { year: number; month: number }[] = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: date.getFullYear(), month: date.getMonth() });
        }

        try {
            const results = await Promise.all(
                months.map(async ({ year, month }) => {
                    const data = await this.getMonthAnalytics(year, month);
                    const label = new Date(year, month, 1).toLocaleString(
                        "default",
                        {
                            month: "short",
                        },
                    );
                    return { year, month, label, ...data };
                }),
            );
            return results;
        } catch (error) {
            console.error(
                "[AnalyticsService] Error getting last N months analytics:",
                error,
            );
            throw new Error("Failed to load analytics data");
        }
    }
}

export const analyticsService = new AnalyticsService();
