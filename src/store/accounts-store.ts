import { create } from "zustand";

import type { Account, NewAccount } from "@db/repositories/account-repository";
import { accountService } from "@features/accounts/services/account.service";

interface AccountsState {
    // State
    accounts: Account[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadAccounts: () => Promise<void>;
    addAccount: (data: NewAccount) => Promise<void>;
    updateAccount: (id: number, data: Partial<NewAccount>) => Promise<void>;
    deleteAccount: (id: number) => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
    accounts: [],
    isLoading: false,
    error: null,

    loadAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
            const accounts = await accountService.getAllAccounts();
            set({ accounts, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
        }
    },

    addAccount: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newAccount = await accountService.createAccount(data);

            set((state) => ({
                accounts: [newAccount, ...state.accounts],
                isLoading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },

    updateAccount: async (id, data) => {
        set({ isLoading: true, error: null });
        const previousAccounts = get().accounts;

        try {
            set((state) => ({
                accounts: state.accounts.map((acc) =>
                    acc.id === id ? { ...acc, ...data } : acc,
                ),
            }));

            await accountService.updateAccount(id, data);
            set({ isLoading: false });
        } catch (error) {
            set({
                accounts: previousAccounts,
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteAccount: async (id) => {
        set({ isLoading: true, error: null });
        const previousAccounts = get().accounts;

        try {
            set((state) => ({
                accounts: state.accounts.filter((acc) => acc.id !== id),
            }));

            await accountService.deleteAccount(id);
            set({ isLoading: false });
        } catch (error) {
            set({
                accounts: previousAccounts,
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },
}));

export const selectTotalBalance = (state: AccountsState) =>
    state.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

export const selectAccountById = (id: number) => (state: AccountsState) =>
    state.accounts.find((acc) => acc.id === id);
