import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';

import { accounts, categories, db, transactions } from '@db/client';

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export interface TransactionWithDetails extends Transaction {
  account: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
}

export interface CategorySpending {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export class TransactionRepository {
  async getAll(): Promise<TransactionWithDetails[]> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .orderBy(desc(transactions.date), desc(transactions.id));

    return result as TransactionWithDetails[];
  }

  async getRecent(limit: number = 20): Promise<TransactionWithDetails[]> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .orderBy(desc(transactions.date), desc(transactions.id))
      .limit(limit);

    return result as TransactionWithDetails[];
  }

  async getById(id: number): Promise<TransactionWithDetails | undefined> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.id, id))
      .limit(1);

    return result[0] as TransactionWithDetails | undefined;
  }

  async getByAccount(accountId: number): Promise<TransactionWithDetails[]> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.accountId, accountId))
      .orderBy(desc(transactions.date), desc(transactions.id));

    return result as TransactionWithDetails[];
  }

  async getByCategory(categoryId: number): Promise<TransactionWithDetails[]> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.categoryId, categoryId))
      .orderBy(desc(transactions.date), desc(transactions.id));

    return result as TransactionWithDetails[];
  }

  async create(data: NewTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewTransaction>): Promise<Transaction> {
    const result = await db
      .update(transactions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  /**
   * Get transactions within date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<TransactionWithDetails[]> {
    const result = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        account: {
          id: accounts.id,
          name: accounts.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
      .orderBy(desc(transactions.date), desc(transactions.id));

    return result as TransactionWithDetails[];
  }

  /**
   * Get spending by category for a date range
   */
  async getCategorySpending(
    startDate: Date,
    endDate: Date,
    type: 'income' | 'expense' = 'expense'
  ): Promise<CategorySpending[]> {
    const result = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        totalAmount: sql<number>`cast(sum(${transactions.amount}) as integer)`,
        transactionCount: sql<number>`cast(count(${transactions.id}) as integer)`,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
          eq(transactions.type, type)
        )
      )
      .groupBy(categories.id, categories.name, categories.icon, categories.color)
      .orderBy(desc(sql`sum(${transactions.amount})`));

    // Calculate total for percentages
    const total = result.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    // Add percentage to each item
    return result.map((item) => ({
      categoryId: item.categoryId!,
      categoryName: item.categoryName!,
      categoryIcon: item.categoryIcon!,
      categoryColor: item.categoryColor!,
      totalAmount: item.totalAmount || 0,
      transactionCount: item.transactionCount || 0,
      percentage: total > 0 ? (item.totalAmount || 0) / total : 0,
    }));
  }
}

export const transactionRepository = new TransactionRepository();
