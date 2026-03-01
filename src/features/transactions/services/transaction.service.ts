import {
    accountRepository,
    categoryRepository,
    transactionRepository,
    type NewTransaction,
    type Transaction,
    type TransactionWithDetails,
} from "@db/repositories";

/**
 * Service Layer for transaction management
 * Contains business logic, validation, and account balance updates
 */
export class TransactionService {
    /**
     * Get all transactions with account and category details
     */
    async getAllTransactions(): Promise<TransactionWithDetails[]> {
        try {
            return await transactionRepository.getAll();
        } catch (error) {
            console.error(
                "[TransactionService] Error getting transactions:",
                error,
            );
            throw new Error("Failed to load transactions");
        }
    }

    /**
     * Get recent transactions (default: 20)
     */
    async getRecentTransactions(
        limit: number = 20,
    ): Promise<TransactionWithDetails[]> {
        try {
            return await transactionRepository.getRecent(limit);
        } catch (error) {
            console.error(
                "[TransactionService] Error getting recent transactions:",
                error,
            );
            throw new Error("Failed to load recent transactions");
        }
    }

    /**
     * Get transaction by ID
     */
    async getTransactionById(id: number): Promise<TransactionWithDetails> {
        try {
            const transaction = await transactionRepository.getById(id);

            if (!transaction) {
                throw new Error(`Transaction with ID ${id} not found`);
            }

            return transaction;
        } catch (error) {
            console.error(
                "[TransactionService] Error getting transaction by id:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to load transaction");
        }
    }

    /**
     * Get transactions by account
     */
    async getTransactionsByAccount(
        accountId: number,
    ): Promise<TransactionWithDetails[]> {
        try {
            return await transactionRepository.getByAccount(accountId);
        } catch (error) {
            console.error(
                "[TransactionService] Error getting transactions by account:",
                error,
            );
            throw new Error("Failed to load transactions for this account");
        }
    }

    /**
     * Get transactions by category
     */
    async getTransactionsByCategory(
        categoryId: number,
    ): Promise<TransactionWithDetails[]> {
        try {
            return await transactionRepository.getByCategory(categoryId);
        } catch (error) {
            console.error(
                "[TransactionService] Error getting transactions by category:",
                error,
            );
            throw new Error("Failed to load transactions for this category");
        }
    }

    /**
     * Create new transaction with validation
     * Automatically updates account balance
     */
    async createTransaction(data: NewTransaction): Promise<Transaction> {
        try {
            // Validation
            await this.validateTransactionData(data);

            // Create transaction
            const transaction = await transactionRepository.create(data);

            // Update account balance
            await this.updateAccountBalance(
                data.accountId,
                data.type === "income" ? data.amount : -data.amount,
            );

            return transaction;
        } catch (error) {
            console.error(
                "[TransactionService] Error creating transaction:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to create transaction");
        }
    }

    /**
     * Update transaction with validation
     * Automatically recalculates account balance
     */
    async updateTransaction(
        id: number,
        data: Partial<NewTransaction>,
    ): Promise<Transaction> {
        try {
            // Get original transaction
            const original = await transactionRepository.getById(id);
            if (!original) {
                throw new Error(`Transaction with ID ${id} not found`);
            }

            // Validate new data
            if (
                data.amount !== undefined ||
                data.type !== undefined ||
                data.accountId !== undefined
            ) {
                await this.validateTransactionData({
                    ...original,
                    ...data,
                } as NewTransaction);
            }

            // Revert original balance change
            const originalDelta =
                original.type === "income" ? original.amount : -original.amount;
            await this.updateAccountBalance(original.accountId, -originalDelta);

            // Update transaction
            const updated = await transactionRepository.update(id, data);

            // Apply new balance change (account might have changed)
            const newAccountId = data.accountId ?? original.accountId;
            const newType = data.type ?? original.type;
            const newAmount = data.amount ?? original.amount;
            const newDelta = newType === "income" ? newAmount : -newAmount;
            await this.updateAccountBalance(newAccountId, newDelta);

            return updated;
        } catch (error) {
            console.error(
                "[TransactionService] Error updating transaction:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to update transaction");
        }
    }

    /**
     * Delete transaction
     * Automatically reverts account balance
     */
    async deleteTransaction(id: number): Promise<void> {
        try {
            // Get transaction to revert balance
            const transaction = await transactionRepository.getById(id);
            if (!transaction) {
                throw new Error(`Transaction with ID ${id} not found`);
            }

            // Revert balance change
            const delta =
                transaction.type === "income"
                    ? transaction.amount
                    : -transaction.amount;
            await this.updateAccountBalance(transaction.accountId, -delta);

            // Delete transaction
            await transactionRepository.delete(id);
        } catch (error) {
            console.error(
                "[TransactionService] Error deleting transaction:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to delete transaction");
        }
    }

    /**
     * Private: Validate transaction data
     */
    private async validateTransactionData(data: NewTransaction): Promise<void> {
        // Amount must be positive
        if (data.amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        // Account must exist
        const account = await accountRepository.getById(data.accountId);
        if (!account) {
            throw new Error("Account not found");
        }

        // Category must exist
        const category = await categoryRepository.getById(data.categoryId);
        if (!category) {
            throw new Error("Category not found");
        }

        // Category type must match transaction type
        if (category.type !== data.type) {
            throw new Error(
                `Category type (${category.type}) does not match transaction type (${data.type})`,
            );
        }

        // Description max length
        if (data.description && data.description.length > 500) {
            throw new Error("Description must be 500 characters or less");
        }
    }

    /**
     * Private: Update account balance
     */
    private async updateAccountBalance(
        accountId: number,
        delta: number,
    ): Promise<void> {
        const account = await accountRepository.getById(accountId);
        if (!account) {
            throw new Error("Account not found");
        }

        const newBalance = (account.balance || 0) + delta;
        await accountRepository.update(accountId, { balance: newBalance });
    }
}

export const transactionService = new TransactionService();
