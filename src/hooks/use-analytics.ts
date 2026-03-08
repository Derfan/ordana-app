import { useCallback, useEffect, useState } from "react";

import type { AnalyticsData, MonthAnalytics } from "@features/analytics";
import { analyticsService } from "@features/analytics";
import { useAppStateActive } from "@hooks/use-app-state";
import { useTransactionsStore } from "@store/transactions-store";

export interface UseMonthAnalyticsResult {
    data: AnalyticsData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useMonthAnalytics(
    year: number,
    month: number,
): UseMonthAnalyticsResult {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const analytics = await analyticsService.getMonthAnalytics(
                year,
                month,
            );
            setData(analytics);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load analytics",
            );
        } finally {
            setIsLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useAppStateActive(loadData);

    return { data, isLoading, error, refresh: loadData };
}

export interface UseLastNMonthsAnalyticsResult {
    data: MonthAnalytics[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

/**
 * Returns analytics for the last N months, oldest → newest.
 * The array maps directly to a chart's X axis — each entry has a `label`
 * ("Jan", "Feb", …) and full `stats` / category breakdowns.
 */
export function useLastNMonthsAnalytics(n = 6): UseLastNMonthsAnalyticsResult {
    const [data, setData] = useState<MonthAnalytics[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const lastUpdatedAt = useTransactionsStore((state) => state.lastUpdatedAt);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const results = await analyticsService.getLastNMonthsAnalytics(n);

            setData(results);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load analytics",
            );
        } finally {
            setIsLoading(false);
        }
    }, [n]);

    useEffect(() => {
        loadData();
    }, [loadData, lastUpdatedAt]);

    useAppStateActive(loadData);

    return { data, isLoading, error, refresh: loadData };
}
