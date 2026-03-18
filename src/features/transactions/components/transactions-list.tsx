import { useTransactions } from '@hooks/use-transactions';
import { Box, Button, createThemedStyles, Text } from '@shared/design-system';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet } from 'react-native';

import { AddTransactionModal } from './add-transaction-modal';
import { TransactionCard } from './transaction-card';

export function TransactionsList() {
  const { transactions, isLoading, error, refresh, addTransaction, deleteTransaction } =
    useTransactions(50);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const styles = useStyles();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleDeleteTransaction = (id: number) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(id);
            Alert.alert('Success', 'Transaction deleted successfully');
          } catch (err) {
            Alert.alert(
              'Error',
              err instanceof Error ? err.message : 'Failed to delete transaction',
            );
          }
        },
      },
    ]);
  };

  if (error && transactions.length === 0) {
    return (
      <Box gap="lg" flex={1} justify="center" align="center">
        <Text style={styles.errorText}>❌ {error}</Text>
        <Button variant="primary" size="md" label="Retry" onPress={refresh} />
      </Box>
    );
  }

  if (isLoading && transactions.length === 0) {
    return (
      <Box gap="sm" flex={1} justify="center" align="center">
        <ActivityIndicator size="large" />
        <Text color="muted">Loading transactions</Text>
      </Box>
    );
  }

  return (
    <>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onLongPress={() => handleDeleteTransaction(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Box paddingY="2xl" align="center" gap="sm">
            <Text style={styles.emptyIcon}>💸</Text>
            <Text variant="heading3">No Transactions</Text>
            <Text color="muted" align="center">
              Start tracking your finances by adding your first transaction
            </Text>
            <Button
              variant="primary"
              size="lg"
              label="Add Transaction"
              onPress={() => setIsModalVisible(true)}
            />
          </Box>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      />

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={addTransaction}
      />
    </>
  );
}

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    errorText: {
      color: theme.colors.fg.danger,
    },
    emptyIcon: {
      fontSize: 80,
      lineHeight: 96,
    },
    listContent: {
      rowGap: theme.spacing[2],
    },
  }),
);
