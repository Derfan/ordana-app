import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@components/themed-text";
import { ThemedView } from "@components/themed-view";
import { IconSymbol } from "@components/ui/icon-symbol";

export default function SettingsScreen() {
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={styles.header}>
                    <ThemedText type="title">Settings</ThemedText>
                </View>

                <View style={styles.menuContainer}>
                    <Link href="/(tabs)/settings/accounts" asChild>
                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <IconSymbol
                                    size={24}
                                    name="creditcard.fill"
                                    color="#0a7ea4"
                                />
                                <View style={styles.menuItemText}>
                                    <ThemedText style={styles.menuItemTitle}>
                                        Accounts
                                    </ThemedText>
                                    <ThemedText style={styles.menuItemSubtitle}>
                                        Manage your accounts
                                    </ThemedText>
                                </View>
                            </View>
                            <IconSymbol
                                size={20}
                                name="chevron.right"
                                color="#9ca3af"
                            />
                        </Pressable>
                    </Link>

                    <Link href="/(tabs)/settings/categories" asChild>
                        <Pressable style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <IconSymbol
                                    size={24}
                                    name="tag.fill"
                                    color="#0a7ea4"
                                />
                                <View style={styles.menuItemText}>
                                    <ThemedText style={styles.menuItemTitle}>
                                        Categories
                                    </ThemedText>
                                    <ThemedText style={styles.menuItemSubtitle}>
                                        Manage your categories
                                    </ThemedText>
                                </View>
                            </View>
                            <IconSymbol
                                size={20}
                                name="chevron.right"
                                color="#9ca3af"
                            />
                        </Pressable>
                    </Link>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 16,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "rgba(0, 122, 255, 0.05)",
        borderRadius: 12,
        marginBottom: 12,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    menuItemText: {
        gap: 4,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: "#6b7280",
    },
});
