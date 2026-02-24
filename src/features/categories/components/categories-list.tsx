import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import type { CategoryType } from '@db/repositories';
import { useCategories } from '@hooks/use-categories';

import { AddCategoryModal } from './add-category-modal';
import { CategoryCard } from './category-card';

export function CategoriesList() {
  const {
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    refresh,
    addCategory,
    deleteCategory,
  } = useCategories();

  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const displayCategories = activeTab === 'income' ? incomeCategories : expenseCategories;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleAddCategory = async (data: any) => {
    await addCategory(data);
  };

  const handleDeleteCategory = (id: number, name: string, isSystem: boolean) => {
    if (isSystem) {
      Alert.alert('Error', 'System categories cannot be deleted');
      return;
    }

    Alert.alert('Delete Category', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
          } catch (error) {
            Alert.alert(
              'Error',
              error instanceof Error ? error.message : 'Failed to delete category'
            );
          }
        },
      },
    ]);
  };

  if (error && displayCategories.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        <Pressable style={styles.retryButton} onPress={refresh}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Categories</ThemedText>
        <Pressable style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'expense' && styles.tabActive]}
          onPress={() => setActiveTab('expense')}>
          <ThemedText style={[styles.tabText, activeTab === 'expense' && styles.tabTextActive]}>
            Expenses ({expenseCategories.length})
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'income' && styles.tabActive]}
          onPress={() => setActiveTab('income')}>
          <ThemedText style={[styles.tabText, activeTab === 'income' && styles.tabTextActive]}>
            Income ({incomeCategories.length})
          </ThemedText>
        </Pressable>
      </View>

      {isLoading && displayCategories.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading categories...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={displayCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onDelete={() => handleDeleteCategory(item.id, item.name, item.isSystem)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyIcon}>📂</ThemedText>
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No Categories
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                {activeTab === 'income'
                  ? 'Create an income category'
                  : 'Create an expense category'}
              </ThemedText>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#0a7ea4"
            />
          }
        />
      )}

      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddCategory}
        defaultType={activeTab}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
