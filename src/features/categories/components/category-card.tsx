import { Pressable, StyleSheet } from "react-native";

import { Text, View, createThemedStyles } from "@shared/design-system";
import type { Category } from "@db/repositories";

interface CategoryCardProps {
    category: Category;
    onPress?: () => void;
    onDelete?: () => void;
    showType?: boolean;
}

export function CategoryCard({
    category,
    onPress,
    onDelete,
    showType = false,
}: CategoryCardProps) {
    const styles = useStyles();

    const typeLabel = category.type === "income" ? "Income" : "Expense";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
            disabled={!onPress}
        >
            <View style={[styles.content, { borderLeftColor: category.color }]}>
                <View colorValue="transparent" style={styles.iconContainer}>
                    <Text style={styles.iconText}>{category.icon}</Text>
                </View>

                <View colorValue="transparent" style={styles.info}>
                    <Text variant="bodySemibold">{category.name}</Text>
                    {showType && (
                        <Text variant="caption" color="muted">
                            {typeLabel}
                            {category.isSystem && " • System"}
                        </Text>
                    )}
                </View>

                {onDelete && !category.isSystem && (
                    <Pressable
                        onPress={onDelete}
                        style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.deleteButtonPressed,
                        ]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${category.name}`}
                    >
                        <Text variant="labelSmall" colorValue="#fff">
                            ✕
                        </Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        card: {
            borderRadius: theme.radii.md,
            overflow: "hidden",
            marginBottom: theme.spacing[2],
        },
        cardPressed: {
            opacity: 0.7,
        },
        content: {
            flexDirection: "row",
            alignItems: "center",
            padding: theme.spacing[3],
            backgroundColor: theme.colors.bg.sunken,
            borderRadius: theme.radii.md,
            borderLeftWidth: 4,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: theme.radii.circle,
            backgroundColor: theme.colors.bg.muted,
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing[3],
        },
        iconText: {
            fontSize: 20,
            lineHeight: 24,
        },
        info: {
            flex: 1,
            gap: theme.spacing[0.5],
        },
        deleteButton: {
            width: 28,
            height: 28,
            borderRadius: theme.radii.circle,
            backgroundColor: theme.colors.accent.danger,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: theme.spacing[2],
        },
        deleteButtonPressed: {
            opacity: 0.7,
            transform: [{ scale: 0.95 }],
        },
    }),
);
