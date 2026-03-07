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
    createThemedStyles,
    useModalFormStyles,
    useTheme,
} from "@shared/design-system";
import type { NewAccount } from "@db/repositories";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    typeIndex: z.number().int().min(0),
    name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
    balance: z.string().refine((v) => v === "" || !isNaN(parseFloat(v)), {
        message: "Enter a valid number",
    }),
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
    { label: "Card", icon: "💳" },
    { label: "Cash", icon: "💵" },
    { label: "Savings", icon: "🏦" },
    { label: "Credit", icon: "💰" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewAccount) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddAccountModal({
    visible,
    onClose,
    onSubmit,
}: AddAccountModalProps) {
    const styles = useStyles();
    const formStyles = useModalFormStyles();
    const theme = useTheme();

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
            typeIndex: 0,
            name: ACCOUNT_TYPES[0].label,
            balance: "0",
        },
    });

    const watchedTypeIndex = watch("typeIndex");
    const watchedName = watch("name");

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    const handleTypeSelect = (index: number) => {
        setValue("typeIndex", index, { shouldValidate: false });
        // Pre-fill name only if user hasn't changed it from a previous type label
        const currentName = watchedName.trim();
        const isStillDefault = ACCOUNT_TYPES.some(
            (t) => t.label === currentName,
        );

        if (!currentName || isStillDefault) {
            setValue("name", ACCOUNT_TYPES[index].label, {
                shouldValidate: false,
            });
        }
    };

    const onValid = async (values: FormValues) => {
        const parsedBalance = parseFloat(values.balance ?? "0") || 0;

        try {
            await onSubmit({
                name: values.name.trim(),
                balance: Math.round(parsedBalance * 100),
            });
            reset();
            onClose();
        } catch (err) {
            Alert.alert(
                "Error",
                err instanceof Error ? err.message : "Failed to create account",
            );
        }
    };

    return (
        <BaseModal
            visible={visible}
            title="New Account"
            onClose={handleClose}
            isSubmitting={isSubmitting}
        >
            {/* Account Type */}
            <FormField label="Account Type">
                <RNView style={styles.typeGrid}>
                    {ACCOUNT_TYPES.map((type, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleTypeSelect(index)}
                            style={[
                                styles.typeButton,
                                watchedTypeIndex === index &&
                                    styles.typeButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{
                                selected: watchedTypeIndex === index,
                            }}
                        >
                            <Text style={styles.typeIcon}>{type.icon}</Text>
                            <Text
                                style={[
                                    styles.typeLabel,
                                    watchedTypeIndex === index &&
                                        styles.typeLabelActive,
                                ]}
                            >
                                {type.label}
                            </Text>
                        </Pressable>
                    ))}
                </RNView>
            </FormField>

            {/* Name */}
            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange, onBlur } }) => (
                    <FormField
                        label="Name"
                        required
                        error={errors.name?.message}
                        hint={`${value.length}/100 characters`}
                    >
                        <TextInput
                            style={[
                                formStyles.input,
                                !!errors.name && styles.inputError,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="e.g., Main Card"
                            placeholderTextColor={theme.colors.text.placeholder}
                            maxLength={100}
                            autoFocus
                            editable={!isSubmitting}
                        />
                    </FormField>
                )}
            />

            {/* Initial Balance */}
            <Controller
                control={control}
                name="balance"
                render={({ field: { value, onChange, onBlur } }) => (
                    <FormField
                        label="Initial Balance"
                        error={errors.balance?.message}
                        hint="Enter the current account balance"
                    >
                        <RNView style={styles.balanceInputWrapper}>
                            <TextInput
                                style={[
                                    formStyles.input,
                                    !!errors.balance && styles.inputError,
                                ]}
                                value={value}
                                onChangeText={(text) =>
                                    onChange(text.replace(/[^0-9.-]/g, ""))
                                }
                                onBlur={onBlur}
                                placeholder="0"
                                placeholderTextColor={
                                    theme.colors.text.placeholder
                                }
                                keyboardType="numeric"
                                editable={!isSubmitting}
                            />
                            <Text style={styles.currencySymbol}>€</Text>
                        </RNView>
                    </FormField>
                )}
            />

            {/* Submit */}
            <RNView style={styles.submitButton}>
                <Button
                    variant="primary"
                    size="lg"
                    label="Create"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    onPress={handleSubmit(onValid)}
                />
            </RNView>
        </BaseModal>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        typeGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing[3],
        },
        typeButton: {
            flex: 1,
            minWidth: "45%",
            alignItems: "center",
            padding: theme.spacing[4],
            borderRadius: theme.radii.md,
            borderWidth: 2,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.surface.subtle,
        },
        typeButtonActive: {
            borderColor: theme.colors.brand.default,
            backgroundColor: theme.colors.surface.overlay,
        },
        typeIcon: {
            fontSize: 32,
            lineHeight: 40,
            marginBottom: theme.spacing[2],
        },
        typeLabel: {
            ...theme.typography.labelSmall,
            color: theme.colors.text.muted,
        },
        typeLabelActive: {
            color: theme.colors.brand.default,
        },
        balanceInputWrapper: {
            position: "relative",
        },
        currencySymbol: {
            position: "absolute",
            right: theme.spacing[4],
            top: theme.spacing[3],
            ...theme.typography.body,
            color: theme.colors.text.muted,
        },
        inputError: {
            borderColor: theme.colors.status.error,
        },
        submitButton: {
            marginTop: theme.spacing[4],
        },
    }),
);
