import { useAppStateActive } from '@hooks/use-app-state';
import { useTransactionsStore } from '@store/transactions-store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import type { PaginationParams } from '@/shared/types/common';

export const useTransactionMethods = () => {
  const { addTransaction, deleteTransaction } = useTransactionsStore(
    useShallow((state) => ({
      addTransaction: state.addTransaction,
      deleteTransaction: state.deleteTransaction,
    })),
  );

  return {
    addTransaction,
    deleteTransaction,
  };
};

/**
 * Hook for working with transactions
 * Automatically loads data when component mounts and app returns to foreground
 */
export function useTransactions(params: PaginationParams) {
  const { addTransaction, deleteTransaction } = useTransactionMethods();
  const { transactions, isLoading, error, loadTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      isLoading: state.isLoading,
      error: state.error,
      loadTransactions: state.loadTransactions,
    })),
  );

  useAppStateActive(() => {
    loadTransactions(params);
  });

  useEffect(() => {
    loadTransactions(params);
  }, [loadTransactions, params]);

  return {
    transactions,
    isLoading,
    error,
    refresh: () => loadTransactions(params),
    addTransaction,
    deleteTransaction,
  };
}

/**
 * Hook for recent transactions
 */
export function useRecentTransactions(limit: number) {
  const { transactions, isLoading, error, loadTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      isLoading: state.isLoading,
      error: state.error,
      loadTransactions: state.loadTransactions,
    })),
  );

  useAppStateActive(() => {
    loadTransactions({ page: 1, limit });
  });

  useEffect(() => {
    loadTransactions({ page: 1, limit });
  }, [loadTransactions, limit]);

  return {
    transactions,
    isLoading,
    error,
    refresh: () => loadTransactions({ page: 1, limit }),
  };
}
