import { useCallback, useEffect, useState } from "react";

import type { AnalyticsData } from "@features/analytics";
import { analyticsService } from "@features/analytics";
import { useAppStateActive } from "@hooks/use-app-state";

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

/**
 * Convenience wrapper that defaults to the current UTC month.
 * Used on the Home screen summary cards.
 */
export function useCurrentMonthAnalytics(): UseMonthAnalyticsResult {
    const now = new Date();
    return useMonthAnalytics(now.getUTCFullYear(), now.getUTCMonth());
}
