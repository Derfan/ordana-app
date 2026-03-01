import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";

import {
    selectAccountById,
    selectTotalBalance,
    useAccountsStore,
} from "@store/accounts-store";

import { useAppStateActive } from "./use-app-state";

/**
 * Custom hook for managing accounts state and actions.
 * Provides an interface to interact with the accounts store.
 * Handles loading accounts on app active state and provides total balance calculation.
 *
 * @returns An object containing accounts data, loading state, error message, and action functions.
 */
export function useAccounts() {
    const { accounts, isLoading, error } = useAccountsStore(
        useShallow((state) => ({
            accounts: state.accounts,
            isLoading: state.isLoading,
            error: state.error,
        })),
    );
    const totalBalance = useAccountsStore(selectTotalBalance);

    const loadAccounts = useAccountsStore((state) => state.loadAccounts);
    const addAccount = useAccountsStore((state) => state.addAccount);
    const updateAccount = useAccountsStore((state) => state.updateAccount);
    const deleteAccount = useAccountsStore((state) => state.deleteAccount);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    useAppStateActive(
        useCallback(() => {
            loadAccounts();
        }, [loadAccounts]),
    );

    return {
        accounts,
        isLoading,
        error,
        refresh: loadAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        totalBalance,
    };
}

/**
 * Custom hook for managing a single account's state and actions.
 * Provides an interface to interact with the accounts store for a specific account.
 *
 * @param id - The ID of the account to manage
 * @returns An object containing the account data and action functions for updating and deleting the account.
 */
export function useAccount(id: number) {
    const account = useAccountsStore(selectAccountById(id));

    const updateAccount = useAccountsStore((state) => state.updateAccount);
    const deleteAccount = useAccountsStore((state) => state.deleteAccount);

    return {
        account,
        updateAccount: (data: Parameters<typeof updateAccount>[1]) =>
            updateAccount(id, data),
        deleteAccount: () => deleteAccount(id),
    };
}
