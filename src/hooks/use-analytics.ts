import { useEffect, useState } from 'react';

import type { AnalyticsData } from '@features/analytics';
import { analyticsService } from '@features/analytics';
import { useAppStateActive } from '@hooks/use-app-state';
import { useTransactionsStore } from '@store/transactions-store';

/**
 * Hook for current month analytics
 */
export function useCurrentMonthAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to transactions count to know when to reload
  const transactionsCount = useTransactionsStore((state) => state.transactions.length);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const analytics = await analyticsService.getCurrentMonthAnalytics();
      setData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useAppStateActive(() => {
    loadData();
  });

  useEffect(() => {
    loadData();
  }, [transactionsCount]);

  return {
    data,
    isLoading,
    error,
    refresh: loadData,
  };
}
