import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@components/themed-text";
import { BaseModal, modalFormStyles } from "@components/ui/base-modal";
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
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
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
            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Type
                </ThemedText>
                <View style={modalFormStyles.typeButtons}>
                    <Pressable
                        onPress={() => setType("expense")}
                        style={[
                            modalFormStyles.typeButton,
                            type === "expense" &&
                                modalFormStyles.typeButtonActiveExpense,
                        ]}
                    >
                        <ThemedText
                            style={[
                                modalFormStyles.typeButtonText,
                                type === "expense" &&
                                    modalFormStyles.typeButtonTextActive,
                            ]}
                        >
                            Expenses
                        </ThemedText>
                    </Pressable>

                    <Pressable
                        onPress={() => setType("income")}
                        style={[
                            modalFormStyles.typeButton,
                            type === "income" &&
                                modalFormStyles.typeButtonActiveIncome,
                        ]}
                    >
                        <ThemedText
                            style={[
                                modalFormStyles.typeButtonText,
                                type === "income" &&
                                    modalFormStyles.typeButtonTextActive,
                            ]}
                        >
                            Income
                        </ThemedText>
                    </Pressable>
                </View>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Name *
                </ThemedText>
                <TextInput
                    style={modalFormStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Groceries"
                    placeholderTextColor="#999"
                    maxLength={50}
                    autoFocus
                    editable={!isSubmitting}
                />
                <ThemedText style={modalFormStyles.hint}>
                    {name.length}/50 characters
                </ThemedText>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Icon
                </ThemedText>
                <View style={styles.iconsGrid}>
                    {CATEGORY_ICONS.map((icon, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedIcon(index)}
                            style={[
                                styles.iconButton,
                                selectedIcon === index &&
                                    styles.iconButtonActive,
                            ]}
                        >
                            <ThemedText style={styles.iconText}>
                                {icon}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Color
                </ThemedText>
                <View style={styles.colorsGrid}>
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
                        >
                            {selectedColor === index && (
                                <ThemedText style={styles.colorCheck}>
                                    ✓
                                </ThemedText>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>

            <Pressable
                style={[
                    styles.button,
                    styles.buttonSubmit,
                    isSubmitting && styles.buttonDisabled,
                ]}
                disabled={isSubmitting}
                onPress={handleSubmit}
            >
                <ThemedText style={styles.buttonSubmitText}>
                    {isSubmitting ? "Creating..." : "Create"}
                </ThemedText>
            </Pressable>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    iconsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    iconButton: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        borderWidth: 2,
        borderColor: "transparent",
    },
    iconButtonActive: {
        backgroundColor: "#e6f4f9",
        borderColor: "#0a7ea4",
    },
    iconText: {
        fontSize: 24,
        lineHeight: 28,
    },
    colorsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    colorButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "transparent",
    },
    colorButtonActive: {
        borderColor: "#000",
    },
    colorCheck: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        lineHeight: 24,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonSubmit: {
        backgroundColor: "#007AFF",
    },
    buttonSubmitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
