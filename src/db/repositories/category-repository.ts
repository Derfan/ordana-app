import { desc, eq } from 'drizzle-orm';

import { categories, db } from '@db/client';

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type CategoryType = 'income' | 'expense';

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(desc(categories.id));
  }

  async getByType(type: CategoryType): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.type, type))
      .orderBy(categories.name);
  }

  async getById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async create(data: NewCategory): Promise<Category> {
    const result = await db.insert(categories).values(data).returning();
    return result[0];
  }

  async createMany(data: NewCategory[]): Promise<Category[]> {
    if (data.length === 0) return [];
    const result = await db.insert(categories).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<NewCategory>): Promise<Category> {
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async count(): Promise<number> {
    const result = await db.select().from(categories);
    return result.length;
  }

  async isEmpty(): Promise<boolean> {
    const count = await this.count();
    return count === 0;
  }
}

export const categoryRepository = new CategoryRepository();
