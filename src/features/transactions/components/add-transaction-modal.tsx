import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { z } from "zod";

import { BaseModal } from "@components/ui/base-modal";
import {
    Button,
    FormField,
    Text,
    View,
    createThemedStyles,
    useModalFormStyles,
    useTheme,
} from "@shared/design-system";
import type { CategoryType, NewTransaction } from "@db/repositories";
import { useAccounts } from "@hooks/use-accounts";
import { useCategories } from "@hooks/use-categories";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    type: z.enum(["expense", "income"]),
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (v) => {
                const n = parseFloat(v);
                return !isNaN(n) && n > 0;
            },
            { message: "Enter a valid amount greater than 0" },
        ),
    accountId: z.number().int().positive("Please select an account"),
    categoryId: z.number().int().positive("Please select a category"),
    description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewTransaction) => Promise<void>;
    defaultType?: CategoryType;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddTransactionModal({
    visible,
    onClose,
    onSubmit,
    defaultType = "expense",
}: AddTransactionModalProps) {
    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

    const { accounts } = useAccounts();
    const { incomeCategories, expenseCategories } = useCategories();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: defaultType,
            amount: "",
            description: "",
        },
    });

    const type = watch("type");
    const selectedAccountId = watch("accountId");
    const selectedCategoryId = watch("categoryId");
    const description = watch("description") ?? "";

    const currentCategories =
        type === "income" ? incomeCategories : expenseCategories;

    const handleTypeChange = (newType: CategoryType) => {
        setValue("type", newType, { shouldValidate: false });
        // Reset category when switching type — previous selection is invalid
        setValue("categoryId", undefined as any, { shouldValidate: false });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    const onValid = async (values: FormValues) => {
        try {
            await onSubmit({
                type: values.type,
                amount: Math.round(parseFloat(values.amount) * 100),
                accountId: values.accountId,
                categoryId: values.categoryId,
                description: values.description?.trim() || undefined,
                date: new Date(),
            });
            reset();
            onClose();
        } catch (err) {
            Alert.alert(
                "Error",
                err instanceof Error
                    ? err.message
                    : "Failed to create transaction",
            );
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
            <FormField label="Type">
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
            </FormField>

            {/* Amount */}
            <FormField label="Amount" required error={errors.amount?.message}>
                <Controller
                    control={control}
                    name="amount"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <View
                            colorValue="transparent"
                            style={[
                                styles.amountInputContainer,
                                !!errors.amount && styles.inputError,
                            ]}
                        >
                            <Text style={styles.currencySymbol}>€</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="0.00"
                                placeholderTextColor={
                                    theme.colors.text.placeholder
                                }
                                keyboardType="decimal-pad"
                                editable={!isSubmitting}
                            />
                        </View>
                    )}
                />
            </FormField>

            {/* Account */}
            <FormField
                label="Account"
                required
                error={errors.accountId?.message}
            >
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
                                        setValue("accountId", account.id, {
                                            shouldValidate: true,
                                        })
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
            </FormField>

            {/* Category */}
            <FormField
                label="Category"
                required
                error={errors.categoryId?.message}
            >
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
                                        setValue("categoryId", category.id, {
                                            shouldValidate: true,
                                        })
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
            </FormField>

            {/* Description */}
            <FormField
                label="Description"
                hint={`${description.length}/500 characters`}
                error={errors.description?.message}
            >
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            style={[formStyles.input, styles.descriptionInput]}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Add a note..."
                            placeholderTextColor={theme.colors.text.placeholder}
                            maxLength={500}
                            multiline
                            numberOfLines={3}
                            editable={!isSubmitting}
                        />
                    )}
                />
            </FormField>

            {/* Date — display only, defaults to today */}
            <FormField label="Date">
                <Text style={styles.dateText}>
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </Text>
            </FormField>

            {/* Submit */}
            <View colorValue="transparent" style={styles.submitButton}>
                <Button
                    variant="primary"
                    size="lg"
                    label="Create"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onPress={handleSubmit(onValid)}
                />
            </View>
        </BaseModal>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
        inputError: {
            borderColor: theme.colors.status.error,
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
