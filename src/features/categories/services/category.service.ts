import {
    categoryRepository,
    type Category,
    type CategoryType,
    type NewCategory,
} from "@db/repositories";

/**
 * Service Layer for category management
 * Contains business logic and validation
 */
export class CategoryService {
    /**
     * Get all categories
     */
    async getAllCategories(): Promise<Category[]> {
        try {
            return await categoryRepository.getAll();
        } catch (error) {
            console.error("[CategoryService] Error getting categories:", error);
            throw new Error("Failed to load categories");
        }
    }

    /**
     * Get categories by type (income/expense)
     */
    async getCategoriesByType(type: CategoryType): Promise<Category[]> {
        try {
            return await categoryRepository.getByType(type);
        } catch (error) {
            console.error(
                "[CategoryService] Error getting categories by type:",
                error,
            );
            throw new Error("Failed to load categories");
        }
    }

    /**
     * Get category by ID
     */
    async getCategoryById(id: number): Promise<Category> {
        try {
            const category = await categoryRepository.getById(id);

            if (!category) {
                throw new Error(`Category with ID ${id} not found`);
            }

            return category;
        } catch (error) {
            console.error(
                "[CategoryService] Error getting category by id:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to load category");
        }
    }

    /**
     * Create new category with validation
     */
    async createCategory(data: NewCategory): Promise<Category> {
        try {
            this.validateCategoryData(data);

            // Check for duplicates by name and type
            const existingCategories = await categoryRepository.getByType(
                data.type,
            );
            const duplicate = existingCategories.find(
                (cat) => cat.name.toLowerCase() === data.name.toLowerCase(),
            );

            if (duplicate) {
                throw new Error("Category with this name already exists");
            }

            return await categoryRepository.create(data);
        } catch (error) {
            console.error("[CategoryService] Error creating category:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to create category");
        }
    }

    /**
     * Update category with validation
     */
    async updateCategory(
        id: number,
        data: Partial<NewCategory>,
    ): Promise<Category> {
        try {
            const category = await this.getCategoryById(id);

            // Cannot modify system categories
            if (category.isSystem) {
                throw new Error("System categories cannot be modified");
            }

            // Validate new data
            if (data.name !== undefined || data.type !== undefined) {
                this.validateCategoryData(data as NewCategory, true);
            }

            // Check for duplicates by name
            if (data.name) {
                const type = data.type || category.type;
                const existingCategories =
                    await categoryRepository.getByType(type);
                const duplicate = existingCategories.find(
                    (cat) =>
                        cat.id !== id &&
                        cat.name.toLowerCase() === data.name!.toLowerCase(),
                );

                if (duplicate) {
                    throw new Error("Category with this name already exists");
                }
            }

            return await categoryRepository.update(id, data);
        } catch (error) {
            console.error("[CategoryService] Error updating category:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to update category");
        }
    }

    /**
     * Delete category
     */
    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.getCategoryById(id);

            // Cannot delete system categories
            if (category.isSystem) {
                throw new Error("System categories cannot be deleted");
            }

            // TODO: Check if there are transactions with this category
            // If yes, either prevent deletion or reassign to another category

            await categoryRepository.delete(id);
        } catch (error) {
            console.error("[CategoryService] Error deleting category:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to delete category");
        }
    }

    /**
     * Validate category data
     */
    private validateCategoryData(
        data: NewCategory,
        isPartial: boolean = false,
    ): void {
        if (!isPartial && !data.name) {
            throw new Error("Category name is required");
        }

        if (data.name !== undefined) {
            if (data.name.trim().length === 0) {
                throw new Error("Category name cannot be empty");
            }

            if (data.name.length > 50) {
                throw new Error(
                    "Category name is too long (max. 50 characters)",
                );
            }
        }

        if (!isPartial && !data.type) {
            throw new Error("Category type is required");
        }

        if (data.type && !["income", "expense"].includes(data.type)) {
            throw new Error("Invalid category type");
        }
    }
}

// Export singleton instance
export const categoryService = new CategoryService();
