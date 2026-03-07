import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
} from "react-native";

import {
    Button,
    Text,
    View,
    createThemedStyles,
    useBottomSheetControls,
} from "@shared/design-system";
import type { CategoryType } from "@db/repositories";
import { useCategories } from "@hooks/use-categories";

import { AddCategoryModal } from "./add-category-modal";
import { CategoryCard } from "./category-card";

export function CategoriesList() {
    const {
        incomeCategories,
        expenseCategories,
        isLoading,
        error,
        refresh,
        deleteCategory,
    } = useCategories();

    const [activeTab, setActiveTab] = useState<CategoryType>("expense");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const addSheet = useBottomSheetControls();

    const styles = useStyles();

    const displayCategories =
        activeTab === "income" ? incomeCategories : expenseCategories;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    const handleDeleteCategory = (
        id: number,
        name: string,
        isSystem: boolean,
    ) => {
        if (isSystem) {
            Alert.alert("Error", "System categories cannot be deleted");
            return;
        }

        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteCategory(id);
                        } catch (err) {
                            Alert.alert(
                                "Error",
                                err instanceof Error
                                    ? err.message
                                    : "Failed to delete category",
                            );
                        }
                    },
                },
            ],
        );
    };

    if (error && displayCategories.length === 0) {
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
                <Text variant="heading1">Categories</Text>
                <Button
                    variant="primary"
                    size="sm"
                    label="+ Add"
                    onPress={addSheet.open}
                />
            </View>

            <View colorValue="transparent" style={styles.tabs}>
                <Pressable
                    style={[
                        styles.tab,
                        activeTab === "expense" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("expense")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "expense" && styles.tabTextActive,
                        ]}
                    >
                        Expenses ({expenseCategories.length})
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.tab,
                        activeTab === "income" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("income")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "income" && styles.tabTextActive,
                        ]}
                    >
                        Income ({incomeCategories.length})
                    </Text>
                </Pressable>
            </View>

            {isLoading && displayCategories.length === 0 ? (
                <View surface="primary" style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                        Loading categories...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={displayCategories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CategoryCard
                            category={item}
                            onDelete={() =>
                                handleDeleteCategory(
                                    item.id,
                                    item.name,
                                    item.isSystem,
                                )
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
                            <Text style={styles.emptyIcon}>📂</Text>
                            <Text variant="heading3">No Categories</Text>
                            <Text style={styles.emptyText}>
                                {activeTab === "income"
                                    ? "Create an income category"
                                    : "Create an expense category"}
                            </Text>
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

            <AddCategoryModal ref={addSheet.ref} defaultType={activeTab} />
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
        tabs: {
            flexDirection: "row",
            paddingHorizontal: theme.spacing[5],
            marginBottom: theme.spacing[4],
            gap: theme.spacing[3],
        },
        tab: {
            flex: 1,
            padding: theme.spacing[3],
            borderRadius: theme.radii.sm,
            alignItems: "center",
            backgroundColor: theme.colors.surface.muted,
        },
        tabActive: {
            backgroundColor: theme.colors.interactive.primary.background,
        },
        tabText: {
            ...theme.typography.labelSmall,
            color: theme.colors.text.muted,
        },
        tabTextActive: {
            color: theme.colors.interactive.primary.text,
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
        },
        errorText: {
            ...theme.typography.body,
            color: theme.colors.status.error,
            marginBottom: theme.spacing[4],
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
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: theme.spacing[4],
        },
        emptyText: {
            ...theme.typography.bodySmall,
            color: theme.colors.text.muted,
            textAlign: "center",
            marginTop: theme.spacing[2],
        },
    }),
);
