import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@components/themed-text";
import { BaseModal, modalFormStyles } from "@components/ui/base-modal";
import type { CategoryType, NewTransaction } from "@db/repositories";
import { useAccounts } from "@hooks/use-accounts";
import { useCategories } from "@hooks/use-categories";

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewTransaction) => Promise<void>;
    defaultType?: CategoryType;
}

export function AddTransactionModal({
    visible,
    onClose,
    onSubmit,
    defaultType = "expense",
}: AddTransactionModalProps) {
    const [type, setType] = useState<CategoryType>(defaultType);
    const [amount, setAmount] = useState("");
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        null,
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { accounts } = useAccounts();
    const { incomeCategories, expenseCategories } = useCategories();

    const currentCategories =
        type === "income" ? incomeCategories : expenseCategories;

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setType(defaultType);
        setAmount("");
        setSelectedAccountId(null);
        setSelectedCategoryId(null);
        setDescription("");
        setDate(new Date());
    };

    const handleTypeChange = (newType: CategoryType) => {
        setType(newType);
        // Reset category selection when type changes
        setSelectedCategoryId(null);
    };

    const handleSubmit = async () => {
        const numAmount = parseFloat(amount);

        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert("Error", "Please enter a valid amount");
            return;
        }

        if (!selectedAccountId) {
            Alert.alert("Error", "Please select an account");
            return;
        }

        if (!selectedCategoryId) {
            Alert.alert("Error", "Please select a category");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert amount to cents (integer)
            const amountInCents = Math.round(numAmount * 100);

            await onSubmit({
                type,
                amount: amountInCents,
                accountId: selectedAccountId,
                categoryId: selectedCategoryId,
                description: description.trim() || undefined,
                date,
            });

            resetForm();
            onClose();
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
                    : "Failed to create transaction",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            title="New Transaction"
            visible={visible}
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
                        onPress={() => handleTypeChange("expense")}
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
                            Expense
                        </ThemedText>
                    </Pressable>

                    <Pressable
                        onPress={() => handleTypeChange("income")}
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
                    Amount *
                </ThemedText>
                <View style={styles.amountInputContainer}>
                    <ThemedText style={styles.currencySymbol}>€</ThemedText>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        editable={!isSubmitting}
                    />
                </View>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Account *
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.optionsContainer}>
                        {accounts.length === 0 ? (
                            <ThemedText style={modalFormStyles.emptyText}>
                                No accounts available
                            </ThemedText>
                        ) : (
                            accounts.map((account) => (
                                <Pressable
                                    key={account.id}
                                    onPress={() =>
                                        setSelectedAccountId(account.id)
                                    }
                                    style={[
                                        styles.optionButton,
                                        selectedAccountId === account.id &&
                                            styles.optionButtonActive,
                                    ]}
                                >
                                    <ThemedText
                                        style={[
                                            styles.optionText,
                                            selectedAccountId === account.id &&
                                                styles.optionTextActive,
                                        ]}
                                    >
                                        {account.name}
                                    </ThemedText>
                                </Pressable>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Category *
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.optionsContainer}>
                        {currentCategories.length === 0 ? (
                            <ThemedText style={modalFormStyles.emptyText}>
                                No categories available
                            </ThemedText>
                        ) : (
                            currentCategories.map((category) => (
                                <Pressable
                                    key={category.id}
                                    onPress={() =>
                                        setSelectedCategoryId(category.id)
                                    }
                                    style={[
                                        styles.categoryButton,
                                        selectedCategoryId === category.id && {
                                            backgroundColor: category.color,
                                            borderColor: category.color,
                                        },
                                    ]}
                                >
                                    <ThemedText style={styles.categoryIcon}>
                                        {category.icon}
                                    </ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.categoryText,
                                            selectedCategoryId ===
                                                category.id &&
                                                styles.categoryTextActive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {category.name}
                                    </ThemedText>
                                </Pressable>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Description (optional)
                </ThemedText>
                <TextInput
                    style={[modalFormStyles.input, styles.descriptionInput]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add a note..."
                    placeholderTextColor="#999"
                    maxLength={500}
                    multiline
                    numberOfLines={3}
                    editable={!isSubmitting}
                />
                <ThemedText style={modalFormStyles.hint}>
                    {description.length}/500 characters
                </ThemedText>
            </View>

            <View style={modalFormStyles.section}>
                <ThemedText
                    type="defaultSemiBold"
                    style={modalFormStyles.label}
                >
                    Date
                </ThemedText>
                <ThemedText style={styles.dateText}>
                    {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </ThemedText>
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
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: "600",
        marginRight: 4,
        color: "#000",
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: "600",
        paddingVertical: 12,
        color: "#000",
    },
    descriptionInput: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    optionsContainer: {
        flexDirection: "row",
        gap: 8,
        paddingVertical: 4,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderWidth: 2,
        borderColor: "transparent",
    },
    optionButtonActive: {
        backgroundColor: "#007AFF",
        borderColor: "#0056b3",
    },
    optionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    optionTextActive: {
        color: "#fff",
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderWidth: 2,
        borderColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    categoryIcon: {
        fontSize: 18,
        lineHeight: 24,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    categoryTextActive: {
        color: "#fff",
    },
    dateText: {
        fontSize: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        color: "#000",
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
