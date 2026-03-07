import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";

import {
    Button,
    Text,
    View,
    createThemedStyles,
    useModalFormStyles,
    useTheme,
} from "@shared/design-system";
import { BaseModal } from "@components/ui/base-modal";
import type { NewAccount } from "@db/repositories";

interface AddAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NewAccount) => Promise<void>;
}

const ACCOUNT_TYPES = [
    { label: "Card", icon: "💳" },
    { label: "Cash", icon: "💵" },
    { label: "Savings", icon: "🏦" },
    { label: "Credit", icon: "💰" },
];

export function AddAccountModal({
    visible,
    onClose,
    onSubmit,
}: AddAccountModalProps) {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("0");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState(0);

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
        setBalance("0");
        setSelectedType(0);
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            Alert.alert("Error", "Please enter an account name");
            return;
        }

        const parsedBalance = parseFloat(balance) || 0;

        setIsSubmitting(true);
        try {
            await onSubmit({
                name: trimmedName,
                balance: Math.round(parsedBalance * 100),
            });

            resetForm();
            onClose();
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
                    : "Failed to create account",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBalanceChange = (text: string) => {
        const cleaned = text.replace(/[^0-9.-]/g, "");
        setBalance(cleaned);
    };

    const handleTypeSelect = (index: number) => {
        setSelectedType(index);
        if (!name.trim()) {
            setName(ACCOUNT_TYPES[index].label);
        }
    };

    return (
        <BaseModal
            visible={visible}
            title="New Account"
            onClose={handleClose}
            isSubmitting={isSubmitting}
        >
            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Account Type
                </Text>
                <View colorValue="transparent" style={styles.typeGrid}>
                    {ACCOUNT_TYPES.map((type, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleTypeSelect(index)}
                            style={[
                                styles.typeButton,
                                selectedType === index &&
                                    styles.typeButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{
                                selected: selectedType === index,
                            }}
                        >
                            <Text style={styles.typeIcon}>{type.icon}</Text>
                            <Text
                                style={[
                                    styles.typeLabel,
                                    selectedType === index &&
                                        styles.typeLabelActive,
                                ]}
                            >
                                {type.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Name *
                </Text>
                <TextInput
                    style={formStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Main Card"
                    placeholderTextColor={theme.colors.text.placeholder}
                    maxLength={100}
                    autoFocus
                    editable={!isSubmitting}
                />
                <Text style={formStyles.hint}>
                    {name.length}/100 characters
                </Text>
            </View>

            <View colorValue="transparent" style={formStyles.section}>
                <Text variant="label" style={formStyles.label}>
                    Initial Balance
                </Text>
                <View
                    colorValue="transparent"
                    style={styles.balanceInputWrapper}
                >
                    <TextInput
                        style={formStyles.input}
                        value={balance}
                        onChangeText={handleBalanceChange}
                        placeholder="0"
                        placeholderTextColor={theme.colors.text.placeholder}
                        keyboardType="numeric"
                        editable={!isSubmitting}
                    />
                    <Text style={styles.currencySymbol}>€</Text>
                </View>
                <Text style={formStyles.hint}>
                    Enter the current account balance
                </Text>
            </View>

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
        submitButton: {
            marginTop: theme.spacing[4],
        },
    }),
);
