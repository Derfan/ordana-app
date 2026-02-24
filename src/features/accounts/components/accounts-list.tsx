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
import { useAccounts } from '@hooks/use-accounts';
import { formatCurrency } from '@utils/currency';

import { AccountCard } from './account-card';
import { AddAccountModal } from './add-account-modal';

export function AccountsList() {
  const { accounts, isLoading, error, refresh, addAccount, deleteAccount, totalBalance } =
    useAccounts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleAddAccount = async (data: any) => {
    await addAccount(data);
  };

  const handleDeleteAccount = (id: number, name: string) => {
    Alert.alert('Delete Account', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount(id);
          } catch (error) {
            Alert.alert(
              'Error',
              error instanceof Error ? error.message : 'Failed to delete account'
            );
          }
        },
      },
    ]);
  };

  if (error && accounts.length === 0) {
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
        <View>
          <ThemedText style={styles.headerLabel}>Total Balance</ThemedText>
          <ThemedText type="title" style={styles.totalBalance}>
            {formatCurrency(totalBalance)}
          </ThemedText>
        </View>
        
        <Pressable
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}>
          <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
        </Pressable>
      </View>

      {isLoading && accounts.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading accounts...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AccountCard
              account={item}
              onDelete={() => handleDeleteAccount(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyIcon}>🏦</ThemedText>
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No Accounts
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Create your first account to start tracking your finances
              </ThemedText>
              <Pressable
                style={styles.emptyButton}
                onPress={() => setIsModalVisible(true)}>
                <ThemedText style={styles.emptyButtonText}>Create Account</ThemedText>
              </Pressable>
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

      <AddAccountModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddAccount}
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
  headerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: '700',
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
