import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    Pressable,
    StyleSheet,
    TextInput,
    View as RNView,
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
import type { CategoryType, NewCategory } from "@db/repositories";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Max 50 characters"),
    type: z.enum(["expense", "income"]),
    iconIndex: z.number().int().min(0),
    colorIndex: z.number().int().min(0),
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewCategory) => Promise<void>;
    defaultType?: CategoryType;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCategoryModal({
    visible,
    onClose,
    onSubmit,
    defaultType = "expense",
}: AddCategoryModalProps) {
    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            type: defaultType,
            iconIndex: 0,
            colorIndex: 0,
        },
    });

    const watchedNameLength = watch("name").length;

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    const onValid = async (values: FormValues) => {
        try {
            await onSubmit({
                name: values.name.trim(),
                type: values.type,
                icon: CATEGORY_ICONS[values.iconIndex],
                color: CATEGORY_COLORS[values.colorIndex],
                isSystem: false,
            });
            reset();
            onClose();
        } catch (err) {
            Alert.alert(
                "Error",
                err instanceof Error
                    ? err.message
                    : "Failed to create category",
            );
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
            <Controller
                control={control}
                name="type"
                render={({ field: { value, onChange } }) => (
                    <FormField label="Type">
                        <RNView style={formStyles.typeButtons}>
                            <Pressable
                                onPress={() => onChange("expense")}
                                style={[
                                    formStyles.typeButton,
                                    value === "expense" &&
                                        formStyles.typeButtonActiveExpense,
                                ]}
                                accessibilityRole="button"
                                accessibilityState={{
                                    selected: value === "expense",
                                }}
                            >
                                <Text
                                    style={[
                                        formStyles.typeButtonText,
                                        value === "expense" &&
                                            formStyles.typeButtonTextActive,
                                    ]}
                                >
                                    Expenses
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => onChange("income")}
                                style={[
                                    formStyles.typeButton,
                                    value === "income" &&
                                        formStyles.typeButtonActiveIncome,
                                ]}
                                accessibilityRole="button"
                                accessibilityState={{
                                    selected: value === "income",
                                }}
                            >
                                <Text
                                    style={[
                                        formStyles.typeButtonText,
                                        value === "income" &&
                                            formStyles.typeButtonTextActive,
                                    ]}
                                >
                                    Income
                                </Text>
                            </Pressable>
                        </RNView>
                    </FormField>
                )}
            />

            {/* Name */}
            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange, onBlur } }) => (
                    <FormField
                        label="Name"
                        required
                        error={errors.name?.message}
                        hint={`${watchedNameLength}/50 characters`}
                    >
                        <TextInput
                            style={[
                                formStyles.input,
                                !!errors.name && styles.inputError,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="e.g., Groceries"
                            placeholderTextColor={theme.colors.text.placeholder}
                            maxLength={50}
                            autoFocus
                            editable={!isSubmitting}
                        />
                    </FormField>
                )}
            />

            {/* Icon */}
            <Controller
                control={control}
                name="iconIndex"
                render={({ field: { value, onChange } }) => (
                    <FormField label="Icon">
                        <RNView style={styles.iconsGrid}>
                            {CATEGORY_ICONS.map((icon, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => onChange(index)}
                                    style={[
                                        styles.iconButton,
                                        value === index &&
                                            styles.iconButtonActive,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Select icon ${icon}`}
                                    accessibilityState={{
                                        selected: value === index,
                                    }}
                                >
                                    <Text style={styles.iconText}>{icon}</Text>
                                </Pressable>
                            ))}
                        </RNView>
                    </FormField>
                )}
            />

            {/* Color */}
            <Controller
                control={control}
                name="colorIndex"
                render={({ field: { value, onChange } }) => (
                    <FormField label="Color">
                        <RNView style={styles.colorsGrid}>
                            {CATEGORY_COLORS.map((color, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => onChange(index)}
                                    style={[
                                        styles.colorButton,
                                        { backgroundColor: color },
                                        value === index &&
                                            styles.colorButtonActive,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Select color ${color}`}
                                    accessibilityState={{
                                        selected: value === index,
                                    }}
                                >
                                    {value === index && (
                                        <Text style={styles.colorCheck}>✓</Text>
                                    )}
                                </Pressable>
                            ))}
                        </RNView>
                    </FormField>
                )}
            />

            {/* Submit */}
            <View colorValue="transparent" style={styles.submitButton}>
                <Button
                    variant="primary"
                    size="lg"
                    label={isSubmitting ? "Creating..." : "Create"}
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
        inputError: {
            borderColor: theme.colors.status.error,
        },
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
