import { Link } from "expo-router";
import { Pressable, StyleSheet, View as RNView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon, Text, View, createThemedStyles } from "@shared/design-system";

interface MenuItemProps {
    href: string;
    icon: string;
    title: string;
    subtitle: string;
}

function MenuItem({ href, icon, title, subtitle }: MenuItemProps) {
    const styles = useStyles();

    return (
        <Link href={href as any} asChild>
            <Pressable>
                {({ pressed }) => (
                    <RNView
                        style={[
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                        ]}
                    >
                        <RNView style={styles.menuItemLeft}>
                            <Icon name={icon as any} size={24} color="brand" />
                            <RNView style={styles.menuItemText}>
                                <Text variant="bodySemibold">{title}</Text>
                                <Text variant="bodySmall" color="muted">
                                    {subtitle}
                                </Text>
                            </RNView>
                        </RNView>
                        <Icon name="chevron.right" size={20} color="default" />
                    </RNView>
                )}
            </Pressable>
        </Link>
    );
}

export default function SettingsScreen() {
    const styles = useStyles();

    return (
        <View surface="primary" style={styles.root}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <RNView style={styles.header}>
                    <Text variant="heading1">Settings</Text>
                </RNView>

                <RNView style={styles.menuContainer}>
                    <MenuItem
                        href="/(tabs)/settings/accounts"
                        icon="creditcard.fill"
                        title="Accounts"
                        subtitle="Manage your accounts"
                    />
                    <MenuItem
                        href="/(tabs)/settings/categories"
                        icon="tag.fill"
                        title="Categories"
                        subtitle="Manage your categories"
                    />
                </RNView>
            </SafeAreaView>
        </View>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        header: {
            padding: theme.spacing[5],
            paddingBottom: theme.spacing[4],
        },
        menuContainer: {
            paddingHorizontal: theme.spacing[5],
        },
        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: theme.spacing[4],
            paddingHorizontal: theme.spacing[4],
            backgroundColor: theme.colors.surface.subtle,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            marginBottom: theme.spacing[3],
        },
        menuItemPressed: {
            opacity: 0.7,
        },
        menuItemLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[4],
        },
        menuItemText: {
            gap: theme.spacing[1],
        },
    }),
);
