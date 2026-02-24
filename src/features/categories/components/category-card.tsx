import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import type { Category } from '@db/repositories';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  onDelete?: () => void;
  showType?: boolean;
}

export function CategoryCard({ category, onPress, onDelete, showType = false }: CategoryCardProps) {
  const typeLabel = category.type === 'income' ? 'Income' : 'Expense';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      disabled={!onPress}>
      <ThemedView style={[styles.content, { borderLeftColor: category.color }]}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{category.icon}</ThemedText>
        </View>

        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {category.name}
          </ThemedText>
          {showType && (
            <ThemedText style={styles.type}>
              {typeLabel}
              {category.isSystem && ' • System'}
            </ThemedText>
          )}
        </View>

        {onDelete && !category.isSystem && (
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ThemedText style={styles.deleteText}>✕</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardPressed: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
  },
  type: {
    fontSize: 12,
    color: '#6b7280',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
