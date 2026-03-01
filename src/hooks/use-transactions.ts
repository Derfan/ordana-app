import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

import type { TransactionWithDetails } from "@db/repositories";
import { useAppStateActive } from "@hooks/use-app-state";
import { useTransactionsStore } from "@store/transactions-store";

/**
 * Hook for working with transactions
 * Automatically loads data when component mounts and app returns to foreground
 */
export function useTransactions(limit?: number) {
    const {
        transactions,
        isLoading,
        error,
        loadTransactions,
        addTransaction,
        deleteTransaction,
    } = useTransactionsStore(
        useShallow((state) => ({
            transactions: state.transactions,
            isLoading: state.isLoading,
            error: state.error,
            loadTransactions: state.loadTransactions,
            addTransaction: state.addTransaction,
            deleteTransaction: state.deleteTransaction,
        })),
    );

    useAppStateActive(() => {
        loadTransactions();
    });

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    // Separate transactions by type
    const { incomeTransactions, expenseTransactions } = useMemo(() => {
        const income = transactions.filter((txn) => txn.type === "income");
        const expense = transactions.filter((txn) => txn.type === "expense");

        return {
            incomeTransactions: income,
            expenseTransactions: expense,
        };
    }, [transactions]);

    const limitedTransactions = useMemo(
        () => (limit ? transactions.slice(0, limit) : transactions),
        [transactions, limit],
    );

    return {
        transactions: limitedTransactions,
        incomeTransactions,
        expenseTransactions,
        isLoading,
        error,
        refresh: loadTransactions,
        addTransaction,
        deleteTransaction,
    };
}

/**
 * Hook for recent transactions
 */
export function useRecentTransactions(limit: number = 20) {
    const { transactions, isLoading, error, loadTransactions } =
        useTransactionsStore(
            useShallow((state) => ({
                transactions: state.transactions,
                isLoading: state.isLoading,
                error: state.error,
                loadTransactions: state.loadTransactions,
            })),
        );

    useAppStateActive(() => {
        loadTransactions();
    });

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    return {
        transactions: transactions.slice(0, limit),
        isLoading,
        error,
        refresh: () => loadTransactions(),
    };
}

/**
 * Hook for transactions by account
 */
export function useTransactionsByAccount(accountId: number): {
    transactions: TransactionWithDetails[];
    isLoading: boolean;
    error: string | null;
} {
    const { transactions, isLoading, error, loadTransactions } =
        useTransactionsStore(
            useShallow((state) => ({
                transactions: state.transactions,
                isLoading: state.isLoading,
                error: state.error,
                loadTransactions: state.loadTransactions,
            })),
        );

    useAppStateActive(() => {
        loadTransactions();
    });

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const accountTransactions = useMemo(
        () => transactions.filter((txn) => txn.accountId === accountId),
        [transactions, accountId],
    );

    return {
        transactions: accountTransactions,
        isLoading,
        error,
    };
}
