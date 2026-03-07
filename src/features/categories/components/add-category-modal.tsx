import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";

import { BaseModal } from "@components/ui/base-modal";
import {
    Button,
    Text,
    View,
    createThemedStyles,
    useModalFormStyles,
    useTheme,
} from "@shared/design-system";
import type { CategoryType, NewCategory } from "@db/repositories";

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewCategory) => Promise<void>;
    defaultType?: CategoryType;
}

const CATEGORY_ICONS = [
    "🍔",
    "🏠",
    "🚗",
    "💊",
    "🎮",
    "🛍️",
    "📚",
    "📱",
    "📺",
    "💰",
    "💼",
    "📈",
    "🎁",
    "✈️",
    "⚡",
    "💵",
    "🍎",
    "🍕",
    "🍺",
    "🎬",
    "🎤",
    "🚿",
    "🧹",
    "🛏️",
    "👕",
    "👟",
    "💡",
    "🧸",
    "🎨",
    "🎧",
    "📷",
    "📖",
    "🛒",
    "💳",
    "🩺",
    "🎓",
];

const CATEGORY_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#6b7280",
    "#f59e0b",
];

export function AddCategoryModal({
    visible,
    onClose,
    onSubmit,
    defaultType = "expense",
}: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<CategoryType>(defaultType);
    const [selectedIcon, setSelectedIcon] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setName("");
        setType(defaultType);
        setSelectedIcon(0);
        setSelectedColor(0);
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            Alert.alert("Error", "Please enter a category name");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                name: trimmedName,
                type,
                icon: CATEGORY_ICONS[selectedIcon],
                color: CATEGORY_COLORS[selectedColor],
                isSystem: false,
            });

            resetForm();
            onClose();
        } catch (err) {
            Alert.alert(
                "Error",
                err instanceof Error
                    ? err.message
                    : "Failed to create category",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            visible={visible}
            title="New Category"
            onClose={handleClose}
            isSubmitting={isSubmitting}
        >
            {/* Type */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Type
                </Text>
                <View colorValue="transparent" style={formStyles.typeButtons}>
                    <Pressable
                        onPress={() => setType("expense")}
                        style={[
                            formStyles.typeButton,
                            type === "expense" &&
                                formStyles.typeButtonActiveExpense,
                        ]}
                    >
                        <Text
                            style={[
                                formStyles.typeButtonText,
                                type === "expense" &&
                                    formStyles.typeButtonTextActive,
                            ]}
                        >
                            Expenses
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setType("income")}
                        style={[
                            formStyles.typeButton,
                            type === "income" &&
                                formStyles.typeButtonActiveIncome,
                        ]}
                    >
                        <Text
                            style={[
                                formStyles.typeButtonText,
                                type === "income" &&
                                    formStyles.typeButtonTextActive,
                            ]}
                        >
                            Income
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Name */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Name *
                </Text>
                <TextInput
                    style={formStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Groceries"
                    placeholderTextColor={theme.colors.text.placeholder}
                    maxLength={50}
                    autoFocus
                    editable={!isSubmitting}
                />
                <Text style={formStyles.hint}>{name.length}/50 characters</Text>
            </View>

            {/* Icon picker */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Icon
                </Text>
                <View colorValue="transparent" style={styles.iconsGrid}>
                    {CATEGORY_ICONS.map((icon, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedIcon(index)}
                            style={[
                                styles.iconButton,
                                selectedIcon === index &&
                                    styles.iconButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Select icon ${icon}`}
                            accessibilityState={{
                                selected: selectedIcon === index,
                            }}
                        >
                            <Text style={styles.iconText}>{icon}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Color picker */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Color
                </Text>
                <View colorValue="transparent" style={styles.colorsGrid}>
                    {CATEGORY_COLORS.map((color, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedColor(index)}
                            style={[
                                styles.colorButton,
                                { backgroundColor: color },
                                selectedColor === index &&
                                    styles.colorButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Select color ${color}`}
                            accessibilityState={{
                                selected: selectedColor === index,
                            }}
                        >
                            {selectedColor === index && (
                                <Text style={styles.colorCheck}>✓</Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Submit */}
            <View colorValue="transparent" style={styles.submitButton}>
                <Button
                    variant="primary"
                    size="lg"
                    label={isSubmitting ? "Creating..." : "Create"}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onPress={handleSubmit}
                />
            </View>
        </BaseModal>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        iconsGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing[2],
        },
        iconButton: {
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radii.sm,
            backgroundColor: theme.colors.surface.muted,
            borderWidth: 2,
            borderColor: "transparent",
        },
        iconButtonActive: {
            backgroundColor: theme.colors.surface.overlay,
            borderColor: theme.colors.border.brandSubtle,
        },
        iconText: {
            fontSize: 24,
            lineHeight: 28,
        },
        colorsGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing[3],
        },
        colorButton: {
            width: 44,
            height: 44,
            borderRadius: theme.radii.full,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "transparent",
        },
        colorButtonActive: {
            borderColor: theme.colors.border.default,
        },
        colorCheck: {
            fontSize: 20,
            fontWeight: "bold" as const,
            color: "#fff",
            lineHeight: 24,
        },
        submitButton: {
            marginTop: theme.spacing[4],
        },
    }),
);
