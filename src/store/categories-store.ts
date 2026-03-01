import { create } from "zustand";

import type { Category, CategoryType, NewCategory } from "@db/repositories";
import { categoryService } from "@features/categories/services/category.service";

interface CategoriesState {
    // State
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadCategories: () => Promise<void>;
    addCategory: (data: NewCategory) => Promise<void>;
    updateCategory: (id: number, data: Partial<NewCategory>) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
}

export const selectCategoriesByType =
    (type: CategoryType) => (state: CategoriesState) =>
        state.categories.filter((cat) => cat.type === type);

export const selectCategoryById = (id: number) => (state: CategoriesState) =>
    state.categories.find((cat) => cat.id === id);

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    loadCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const categories = await categoryService.getAllCategories();
            set({ categories, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
        }
    },

    addCategory: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newCategory = await categoryService.createCategory(data);

            set((state) => ({
                categories: [newCategory, ...state.categories],
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

    updateCategory: async (id, data) => {
        set({ isLoading: true, error: null });
        const previousCategories = get().categories;

        try {
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id === id ? { ...cat, ...data } : cat,
                ),
            }));

            await categoryService.updateCategory(id, data);
            set({ isLoading: false });
        } catch (error) {
            set({
                categories: previousCategories,
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        const previousCategories = get().categories;

        try {
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== id),
            }));

            await categoryService.deleteCategory(id);
            set({ isLoading: false });
        } catch (error) {
            set({
                categories: previousCategories,
                error: error instanceof Error ? error.message : "Unknown error",
                isLoading: false,
            });
            throw error;
        }
    },
}));
