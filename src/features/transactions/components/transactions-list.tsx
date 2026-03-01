import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";

import { ThemedText } from "@components/themed-text";
import { ThemedView } from "@components/themed-view";
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
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                error instanceof Error
                                    ? error.message
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
            <ThemedView style={styles.centerContainer}>
                <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
                <Pressable style={styles.retryButton} onPress={() => refresh()}>
                    <ThemedText style={styles.retryButtonText}>
                        Retry
                    </ThemedText>
                </Pressable>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">History</ThemedText>
                <Pressable
                    style={styles.addButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
                </Pressable>
            </View>

            {isLoading && transactions.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0a7ea4" />
                    <ThemedText style={styles.loadingText}>
                        Loading transactions...
                    </ThemedText>
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
                        <View style={styles.emptyContainer}>
                            <ThemedText style={styles.emptyIcon}>💸</ThemedText>
                            <ThemedText
                                type="subtitle"
                                style={styles.emptyTitle}
                            >
                                No Transactions
                            </ThemedText>
                            <ThemedText style={styles.emptyText}>
                                Start tracking your finances by adding your
                                first transaction
                            </ThemedText>
                            <Pressable
                                style={styles.emptyButton}
                                onPress={() => setIsModalVisible(true)}
                            >
                                <ThemedText style={styles.emptyButtonText}>
                                    Add Transaction
                                </ThemedText>
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

            <AddTransactionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddTransaction}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingBottom: 16,
    },
    addButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        opacity: 0.6,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },
    retryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
        lineHeight: 96,
    },
    emptyTitle: {
        fontSize: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: "center",
        marginBottom: 24,
        paddingHorizontal: 40,
    },
    emptyButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
