import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

import type { CategoryType } from "@db/repositories";
import {
    selectCategoriesByType,
    selectCategoryById,
    useCategoriesStore,
} from "@store/categories-store";

import { useAppStateActive } from "./use-app-state";

/**
 * Custom hook for managing categories state and actions.
 * Provides an interface to interact with the categories store.
 * Handles loading categories on app active state and provides separate lists for income and expense categories.
 *
 * @returns An object containing categories data, loading state, error message, and action functions.
 */
export function useCategories() {
    const { categories, isLoading, error } = useCategoriesStore(
        useShallow((state) => ({
            categories: state.categories,
            isLoading: state.isLoading,
            error: state.error,
        })),
    );

    const loadCategories = useCategoriesStore((state) => state.loadCategories);
    const addCategory = useCategoriesStore((state) => state.addCategory);
    const updateCategory = useCategoriesStore((state) => state.updateCategory);
    const deleteCategory = useCategoriesStore((state) => state.deleteCategory);

    // Separate categories by type
    const incomeCategories = useMemo(
        () => categories.filter((cat) => cat.type === "income"),
        [categories],
    );

    const expenseCategories = useMemo(
        () => categories.filter((cat) => cat.type === "expense"),
        [categories],
    );

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleAppActive = useCallback(() => {
        loadCategories();
    }, [loadCategories]);

    useAppStateActive(handleAppActive);

    return {
        categories,
        incomeCategories,
        expenseCategories,
        isLoading,
        error,
        refresh: loadCategories,
        addCategory,
        updateCategory,
        deleteCategory,
    };
}

/**
 * Custom hook for managing categories by type (income/expense).
 * Provides an interface to interact with the categories store for a specific type.
 *
 * @param type - The type of categories to manage ('income' or 'expense')
 * @returns An object containing the categories of the specified type, loading state, and a refresh function.
 */
export function useCategoriesByType(type: CategoryType) {
    const categories = useCategoriesStore(selectCategoriesByType(type));
    const isLoading = useCategoriesStore((state) => state.isLoading);
    const loadCategories = useCategoriesStore((state) => state.loadCategories);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    return {
        categories,
        isLoading,
        refresh: loadCategories,
    };
}

/**
 * Custom hook for managing a single category's state and actions.
 * Provides an interface to interact with the categories store for a specific category.
 *
 * @param id - The ID of the category to manage
 * @returns An object containing the category data and action functions for updating and deleting the category.
 */
export function useCategory(id: number) {
    const category = useCategoriesStore(selectCategoryById(id));
    const updateCategory = useCategoriesStore((state) => state.updateCategory);
    const deleteCategory = useCategoriesStore((state) => state.deleteCategory);

    return {
        category,
        updateCategory: (data: Parameters<typeof updateCategory>[1]) =>
            updateCategory(id, data),
        deleteCategory: () => deleteCategory(id),
    };
}
