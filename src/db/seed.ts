import { categoryRepository, type NewCategory } from '@db/repositories';

/**
 * Default categories for first app launch
 */
const DEFAULT_CATEGORIES: NewCategory[] = [
  // Expenses
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444', isSystem: true },
  { name: 'Housing', type: 'expense', icon: '🏠', color: '#f97316', isSystem: true },
  { name: 'Transportation', type: 'expense', icon: '🚗', color: '#eab308', isSystem: true },
  { name: 'Healthcare', type: 'expense', icon: '💊', color: '#22c55e', isSystem: true },
  { name: 'Entertainment', type: 'expense', icon: '🎮', color: '#06b6d4', isSystem: true },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#8b5cf6', isSystem: true },
  { name: 'Education', type: 'expense', icon: '📚', color: '#3b82f6', isSystem: true },
  { name: 'Communication', type: 'expense', icon: '📱', color: '#6366f1', isSystem: true },
  { name: 'Subscriptions', type: 'expense', icon: '📺', color: '#a855f7', isSystem: true },
  { name: 'Other', type: 'expense', icon: '📦', color: '#6b7280', isSystem: true },

  // Income
  { name: 'Salary', type: 'income', icon: '💰', color: '#10b981', isSystem: true },
  { name: 'Freelance', type: 'income', icon: '💼', color: '#059669', isSystem: true },
  { name: 'Investments', type: 'income', icon: '📈', color: '#14b8a6', isSystem: true },
  { name: 'Gifts', type: 'income', icon: '🎁', color: '#06b6d4', isSystem: true },
  { name: 'Other', type: 'income', icon: '💵', color: '#6b7280', isSystem: true },
];

/**
 * Initialize default categories on first launch
 */
export async function seedCategories(): Promise<void> {
  try {
    const isEmpty = await categoryRepository.isEmpty();

    if (isEmpty) {
      console.log('[Seed] Initializing default categories...');
      await categoryRepository.createMany(DEFAULT_CATEGORIES);
      console.log(`[Seed] Created ${DEFAULT_CATEGORIES.length} categories`);
    } else {
      console.log('[Seed] Categories already exist, skipping');
    }
  } catch (error) {
    console.error('[Seed] Error seeding categories:', error);
    throw new Error('Failed to initialize categories');
  }
}

/**
 * Full database seeding
 */
export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Starting database initialization...');

  try {
    await seedCategories();
    // TODO: Add seeding for other entities if needed

    console.log('[Seed] Initialization completed successfully');
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error);
    throw error;
  }
}
