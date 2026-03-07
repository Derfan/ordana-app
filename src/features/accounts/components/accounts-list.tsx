import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
} from "react-native";

import { Button, Text, View, createThemedStyles } from "@shared/design-system";
import { useAccounts } from "@hooks/use-accounts";
import { formatCurrency } from "@shared/utils/currency";

import { AccountCard } from "./account-card";
import { AddAccountModal } from "./add-account-modal";

export function AccountsList() {
    const {
        accounts,
        isLoading,
        error,
        refresh,
        addAccount,
        deleteAccount,
        totalBalance,
    } = useAccounts();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const styles = useStyles();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    const handleAddAccount = async (data: any) => {
        await addAccount(data);
    };

    const handleDeleteAccount = (id: number, name: string) => {
        Alert.alert(
            "Delete Account",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount(id);
                        } catch (err) {
                            Alert.alert(
                                "Error",
                                err instanceof Error
                                    ? err.message
                                    : "Failed to delete account",
                            );
                        }
                    },
                },
            ],
        );
    };

    if (error && accounts.length === 0) {
        return (
            <View surface="primary" style={styles.centerContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Button
                    variant="primary"
                    size="md"
                    label="Retry"
                    onPress={refresh}
                />
            </View>
        );
    }

    return (
        <View surface="primary" style={styles.container}>
            <View surface="primary" style={styles.header}>
                <View
                    colorValue="transparent"
                    style={styles.headerBalanceBlock}
                >
                    <Text variant="bodySmall" color="muted">
                        Total Balance
                    </Text>
                    <Text variant="heading1">
                        {formatCurrency(totalBalance)}
                    </Text>
                </View>

                <Button
                    variant="primary"
                    size="sm"
                    label="+ Add"
                    onPress={() => setIsModalVisible(true)}
                />
            </View>

            {isLoading && accounts.length === 0 ? (
                <View surface="primary" style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Loading accounts...</Text>
                </View>
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <AccountCard
                            account={item}
                            onDelete={() =>
                                handleDeleteAccount(item.id, item.name)
                            }
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View
                            colorValue="transparent"
                            style={styles.emptyContainer}
                        >
                            <Text style={styles.emptyIcon}>🏦</Text>
                            <Text variant="heading3">No Accounts</Text>
                            <Text style={styles.emptyText}>
                                Create your first account to start tracking your
                                finances
                            </Text>
                            <Button
                                variant="primary"
                                size="lg"
                                label="Create Account"
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

            <AddAccountModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddAccount}
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
        headerBalanceBlock: {
            gap: theme.spacing[1],
        },
        listContent: {
            flexGrow: 1,
            paddingHorizontal: theme.spacing[5],
            paddingBottom: 0,
        },
        centerContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing[5],
            gap: theme.spacing[4],
        },
        errorText: {
            ...theme.typography.body,
            color: theme.colors.status.error,
            textAlign: "center",
        },
        loadingText: {
            ...theme.typography.bodySmall,
            color: theme.colors.text.muted,
            marginTop: theme.spacing[3],
        },
        emptyContainer: {
            alignItems: "center",
            paddingVertical: theme.spacing[16],
            gap: theme.spacing[2],
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: theme.spacing[2],
        },
        emptyText: {
            ...theme.typography.bodySmall,
            color: theme.colors.text.muted,
            textAlign: "center",
            lineHeight: 20,
            marginBottom: theme.spacing[4],
        },
    }),
);
