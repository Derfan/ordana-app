import {
    accountRepository,
    type Account,
    type NewAccount,
} from "@db/repositories";

export class AccountService {
    async getAllAccounts(): Promise<Account[]> {
        try {
            return await accountRepository.getAll();
        } catch (error) {
            console.error("[AccountService] Error getting accounts:", error);
            throw new Error("Failed to load accounts");
        }
    }

    async getAccountById(id: number): Promise<Account> {
        try {
            const account = await accountRepository.getById(id);

            if (!account) {
                throw new Error(`Account with ID ${id} not found`);
            }

            return account;
        } catch (error) {
            console.error(
                "[AccountService] Error getting account by id:",
                error,
            );
            throw error instanceof Error
                ? error
                : new Error("Failed to load account");
        }
    }

    async createAccount(data: NewAccount): Promise<Account> {
        try {
            this.validateAccountData(data);

            const existingAccounts = await accountRepository.getAll();
            const duplicate = existingAccounts.find(
                (acc) => acc.name.toLowerCase() === data.name.toLowerCase(),
            );

            if (duplicate) {
                throw new Error("Account with this name already exists");
            }

            return await accountRepository.create(data);
        } catch (error) {
            console.error("[AccountService] Error creating account:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to create account");
        }
    }

    async updateAccount(
        id: number,
        data: Partial<NewAccount>,
    ): Promise<Account> {
        try {
            await this.getAccountById(id);

            if (data.name !== undefined || data.balance !== undefined) {
                this.validateAccountData(data as NewAccount, true);
            }

            if (data.name) {
                const existingAccounts = await accountRepository.getAll();
                const duplicate = existingAccounts.find(
                    (acc) =>
                        acc.id !== id &&
                        acc.name.toLowerCase() === data.name!.toLowerCase(),
                );

                if (duplicate) {
                    throw new Error("Account with this name already exists");
                }
            }

            return await accountRepository.update(id, data);
        } catch (error) {
            console.error("[AccountService] Error updating account:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to update account");
        }
    }

    async deleteAccount(id: number): Promise<void> {
        try {
            await this.getAccountById(id);
            await accountRepository.delete(id);
        } catch (error) {
            console.error("[AccountService] Error deleting account:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to delete account");
        }
    }

    async getTotalBalance(): Promise<number> {
        try {
            return await accountRepository.getTotalBalance();
        } catch (error) {
            console.error(
                "[AccountService] Error getting total balance:",
                error,
            );
            throw new Error("Failed to get total balance");
        }
    }

    async updateBalance(id: number, amount: number): Promise<Account> {
        try {
            const account = await this.getAccountById(id);
            const newBalance = (account.balance || 0) + amount;

            if (newBalance < 0) {
                throw new Error("Insufficient funds in the account");
            }

            return await accountRepository.update(id, { balance: newBalance });
        } catch (error) {
            console.error("[AccountService] Error updating balance:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to update balance");
        }
    }

    private validateAccountData(
        data: NewAccount,
        isPartial: boolean = false,
    ): void {
        if (!isPartial && !data.name) {
            throw new Error("Account name is required");
        }

        if (data.name !== undefined) {
            if (data.name.trim().length === 0) {
                throw new Error("Account name cannot be empty");
            }

            if (data.name.length > 100) {
                throw new Error(
                    "Account name is too long (max. 100 characters)",
                );
            }
        }

        if (data.balance !== undefined && data.balance !== null) {
            if (!Number.isFinite(data.balance)) {
                throw new Error("Balance must be a number");
            }
        }
    }
}

export const accountService = new AccountService();
