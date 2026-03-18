import type { TransactionWithDetails } from '@db/repositories';
import type { LegendListProps } from '@legendapp/list';
import { useTransactionsStore } from '@store/transactions-store';
import { useCallback, useEffect, useRef, useState } from 'react';

import { transactionService } from '../services/transaction.service';

const DEFAULT_PAGE_SIZE = 20;

interface UseInfiniteTransactionsReturn {
  data: TransactionWithDetails[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  onEndReached: LegendListProps['onEndReached'];
  onEndReachedThreshold: LegendListProps['onEndReachedThreshold'];
}

export const useInfiniteTransactions = (
  pageSize = DEFAULT_PAGE_SIZE,
): UseInfiniteTransactionsReturn => {
  const [data, setData] = useState<TransactionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs to avoid stale closures in callbacks
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Auto-refresh when mutations happen (add/update/delete)
  const lastUpdatedAt = useTransactionsStore((state) => state.lastUpdatedAt);

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const result = await transactionService.getTransactionsPaginated({
          page,
          limit: pageSize,
        });

        setData((prev) => (append ? [...prev, ...result.items] : result.items));
        hasMoreRef.current = page < result.totalPages;
        pageRef.current = page;
      } catch (error) {
        console.error('[useInfiniteScroll] Failed to load page:', error);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  const refresh = useCallback(async () => {
    hasMoreRef.current = true;
    pageRef.current = 1;
    await fetchPage(1, false);
  }, [fetchPage]);

  // Initial load
  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  // Re-fetch from page 1 after a mutation in the store
  useEffect(() => {
    if (lastUpdatedAt === 0) return;
    refresh();
  }, [lastUpdatedAt, refresh]);

  const onEndReached = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return;

    fetchPage(pageRef.current + 1, true);
  }, [fetchPage]);

  return {
    data,
    isLoading,
    refresh,
    onEndReached,
    onEndReachedThreshold: 0.5,
  };
};
