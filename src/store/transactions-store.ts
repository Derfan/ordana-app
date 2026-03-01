import { create } from "zustand";

import type { NewTransaction, TransactionWithDetails } from "@db/repositories";
import { transactionService } from "@features/transactions/services/transaction.service";

import { useAccountsStore } from "./accounts-store";

interface TransactionsState {
    // State
    transactions: TransactionWithDetails[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadTransactions: () => Promise<void>;
    addTransaction: (data: NewTransaction) => Promise<void>;
    updateTransaction: (
        id: number,
        data: Partial<NewTransaction>,
    ) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
}

// Selectors
export const selectRecentTransactions =
    (limit: number) => (state: TransactionsState) =>
        state.transactions.slice(0, limit);

export const selectTransactionsByAccount =
    (accountId: number) => (state: TransactionsState) =>
        state.transactions.filter((txn) => txn.accountId === accountId);

export const selectTransactionsByCategory =
    (categoryId: number) => (state: TransactionsState) =>
        state.transactions.filter((txn) => txn.categoryId === categoryId);

export const selectTransactionsByType =
    (type: "income" | "expense") => (state: TransactionsState) =>
        state.transactions.filter((txn) => txn.type === type);

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
    transactions: [],
    isLoading: false,
    error: null,

    loadTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            // Always load all transactions for the store
            const transactions = await transactionService.getAllTransactions();

            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
        }
    },

    addTransaction: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.createTransaction(data);

            // Reload ALL transactions (not just recent)
            const transactions = await transactionService.getAllTransactions();

            set({ transactions, isLoading: false });

            // Reload accounts to update balance
            await useAccountsStore.getState().loadAccounts();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },

    updateTransaction: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.updateTransaction(id, data);

            // Reload ALL transactions
            const transactions = await transactionService.getAllTransactions();

            set({ transactions, isLoading: false });

            // Reload accounts to update balance
            await useAccountsStore.getState().loadAccounts();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.deleteTransaction(id);

            // Remove from local state
            set((state) => ({
                transactions: state.transactions.filter((txn) => txn.id !== id),
                isLoading: false,
            }));

            // Reload accounts to update balance
            await useAccountsStore.getState().loadAccounts();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },
}));
