import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
} from "react-native";

import { Button, Text, View, createThemedStyles } from "@shared/design-system";
import { useTransactions } from "@hooks/use-transactions";

import { AddTransactionModal } from "./add-transaction-modal";
import { TransactionCard } from "./transaction-card";

export function TransactionsList() {
    const {
        transactions,
        isLoading,
        error,
        refresh,
        addTransaction,
        deleteTransaction,
    } = useTransactions(50);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const styles = useStyles();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    const handleAddTransaction = async (data: any) => {
        await addTransaction(data);
    };

    const handleDeleteTransaction = (id: number) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTransaction(id);
                            Alert.alert(
                                "Success",
                                "Transaction deleted successfully",
                            );
                        } catch (err) {
                            Alert.alert(
                                "Error",
                                err instanceof Error
                                    ? err.message
                                    : "Failed to delete transaction",
                            );
                        }
                    },
                },
            ],
        );
    };

    if (error && transactions.length === 0) {
        return (
            <View surface="page" style={styles.centerContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Button
                    variant="primary"
                    size="md"
                    label="Retry"
                    onPress={() => refresh()}
                />
            </View>
        );
    }

    return (
        <View surface="page" style={styles.container}>
            <View surface="page" style={styles.header}>
                <Text variant="heading1">History</Text>
                <Button
                    variant="primary"
                    size="sm"
                    label="+ Add"
                    onPress={() => setIsModalVisible(true)}
                />
            </View>

            {isLoading && transactions.length === 0 ? (
                <View surface="page" style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                        Loading transactions...
                    </Text>
                </View>
            ) : (
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
                        <View
                            colorValue="transparent"
                            style={styles.emptyContainer}
                        >
                            <Text style={styles.emptyIcon}>💸</Text>
                            <Text variant="heading3">No Transactions</Text>
                            <Text style={styles.emptyText}>
                                Start tracking your finances by adding your
                                first transaction
                            </Text>
                            <Button
                                variant="primary"
                                size="lg"
                                label="Add Transaction"
                                onPress={() => setIsModalVisible(true)}
                            />
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            )}

            <AddTransactionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddTransaction}
            />
        </View>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing[5],
            paddingBottom: theme.spacing[4],
        },
        listContent: {
            padding: theme.spacing[5],
            paddingTop: 0,
            paddingBottom: theme.spacing[10],
        },
        centerContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing[5],
            gap: theme.spacing[4],
        },
        loadingText: {
            ...theme.typography.bodySmall,
            color: theme.colors.fg.muted,
            marginTop: theme.spacing[3],
        },
        errorText: {
            ...theme.typography.body,
            color: theme.colors.fg.danger,
            textAlign: "center",
        },
        emptyContainer: {
            alignItems: "center",
            paddingVertical: theme.spacing[16],
            gap: theme.spacing[2],
        },
        emptyIcon: {
            fontSize: 80,
            lineHeight: 96,
            marginBottom: theme.spacing[2],
        },
        emptyText: {
            ...theme.typography.bodySmall,
            color: theme.colors.fg.muted,
            textAlign: "center",
            marginBottom: theme.spacing[4],
            paddingHorizontal: theme.spacing[10],
        },
    }),
);
