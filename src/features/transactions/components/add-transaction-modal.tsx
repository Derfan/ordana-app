import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";

import { BaseModal } from "@components/ui/base-modal";
import {
    Button,
    Text,
    View,
    createThemedStyles,
    useModalFormStyles,
    useTheme,
} from "@shared/design-system";
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

    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

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
        } catch (err) {
            Alert.alert(
                "Error",
                err instanceof Error
                    ? err.message
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
            {/* Type */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Type
                </Text>
                <View colorValue="transparent" style={formStyles.typeButtons}>
                    <Pressable
                        onPress={() => handleTypeChange("expense")}
                        style={[
                            formStyles.typeButton,
                            type === "expense" &&
                                formStyles.typeButtonActiveExpense,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: type === "expense" }}
                    >
                        <Text
                            style={[
                                formStyles.typeButtonText,
                                type === "expense" &&
                                    formStyles.typeButtonTextActive,
                            ]}
                        >
                            Expense
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => handleTypeChange("income")}
                        style={[
                            formStyles.typeButton,
                            type === "income" &&
                                formStyles.typeButtonActiveIncome,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: type === "income" }}
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

            {/* Amount */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Amount *
                </Text>
                <View
                    colorValue="transparent"
                    style={styles.amountInputContainer}
                >
                    <Text style={styles.currencySymbol}>€</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor={theme.colors.text.placeholder}
                        keyboardType="decimal-pad"
                        editable={!isSubmitting}
                    />
                </View>
            </View>

            {/* Account */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Account *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                        colorValue="transparent"
                        style={styles.optionsContainer}
                    >
                        {accounts.length === 0 ? (
                            <Text style={formStyles.emptyText}>
                                No accounts available
                            </Text>
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
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected:
                                            selectedAccountId === account.id,
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedAccountId === account.id &&
                                                styles.optionTextActive,
                                        ]}
                                    >
                                        {account.name}
                                    </Text>
                                </Pressable>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Category */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Category *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                        colorValue="transparent"
                        style={styles.optionsContainer}
                    >
                        {currentCategories.length === 0 ? (
                            <Text style={formStyles.emptyText}>
                                No categories available
                            </Text>
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
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected:
                                            selectedCategoryId === category.id,
                                    }}
                                >
                                    <Text style={styles.categoryIcon}>
                                        {category.icon}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selectedCategoryId ===
                                                category.id &&
                                                styles.categoryTextActive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Description */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Description (optional)
                </Text>
                <TextInput
                    style={[formStyles.input, styles.descriptionInput]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add a note..."
                    placeholderTextColor={theme.colors.text.placeholder}
                    maxLength={500}
                    multiline
                    numberOfLines={3}
                    editable={!isSubmitting}
                />
                <Text style={formStyles.hint}>
                    {description.length}/500 characters
                </Text>
            </View>

            {/* Date */}
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Date
                </Text>
                <Text style={styles.dateText}>
                    {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </Text>
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
        amountInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            borderRadius: theme.radii.sm,
            paddingHorizontal: theme.spacing[3],
            backgroundColor: theme.colors.surface.primary,
        },
        currencySymbol: {
            ...theme.typography.amountInput,
            color: theme.colors.text.primary,
            marginRight: theme.spacing[1],
        },
        amountInput: {
            flex: 1,
            ...theme.typography.amountInput,
            paddingVertical: theme.spacing[3],
            color: theme.colors.text.primary,
        },
        descriptionInput: {
            minHeight: 80,
            textAlignVertical: "top",
        },
        optionsContainer: {
            flexDirection: "row",
            gap: theme.spacing[2],
            paddingVertical: theme.spacing[1],
        },
        optionButton: {
            paddingVertical: theme.spacing[2],
            paddingHorizontal: theme.spacing[4],
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.surface.muted,
            borderWidth: 2,
            borderColor: "transparent",
        },
        optionButtonActive: {
            backgroundColor: theme.colors.interactive.primary.background,
            borderColor: theme.colors.brand.strong,
        },
        optionText: {
            ...theme.typography.labelSmall,
            color: theme.colors.text.primary,
        },
        optionTextActive: {
            color: theme.colors.interactive.primary.text,
        },
        categoryButton: {
            paddingVertical: theme.spacing[2],
            paddingHorizontal: theme.spacing[3],
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.surface.muted,
            borderWidth: 2,
            borderColor: "transparent",
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[1],
        },
        categoryIcon: {
            fontSize: 18,
            lineHeight: 24,
        },
        categoryText: {
            ...theme.typography.labelSmall,
            color: theme.colors.text.primary,
        },
        categoryTextActive: {
            color: "#fff",
        },
        dateText: {
            ...theme.typography.body,
            padding: theme.spacing[3],
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            borderRadius: theme.radii.sm,
            backgroundColor: theme.colors.surface.subtle,
            color: theme.colors.text.primary,
        },
        submitButton: {
            marginTop: theme.spacing[4],
        },
    }),
);
