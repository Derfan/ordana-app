import { desc, eq } from 'drizzle-orm';

import { accounts, db } from '@db/client';

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export class AccountRepository {
  async getAll(): Promise<Account[]> {
    return await db.select().from(accounts).orderBy(desc(accounts.id));
  }

  async getById(id: number): Promise<Account | undefined> {
    const result = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);

    return result[0];
  }

  async create(data: NewAccount): Promise<Account> {
    const result = await db.insert(accounts).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewAccount>): Promise<Account> {
    const result = await db
      .update(accounts)
      .set(data)
      .where(eq(accounts.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await db.delete(accounts).where(eq(accounts.id, id));
  }

  async getTotalBalance(): Promise<number> {
    const allAccounts = await this.getAll();

    return allAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }
}

export const accountRepository = new AccountRepository();
