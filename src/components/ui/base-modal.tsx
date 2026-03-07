import { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from "react-native";

import { Text, View, createThemedStyles } from "@shared/design-system";

interface BaseModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    isSubmitting?: boolean;
}

export function BaseModal({
    visible,
    title,
    onClose,
    children,
    isSubmitting = false,
}: BaseModalProps) {
    const styles = useStyles();

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View surface="primary" style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View surface="primary" style={styles.header}>
                            <Text variant="heading1">{title}</Text>
                            <Pressable
                                onPress={handleClose}
                                disabled={isSubmitting}
                                hitSlop={{
                                    top: 12,
                                    bottom: 12,
                                    left: 12,
                                    right: 12,
                                }}
                                style={({ pressed }) =>
                                    pressed && styles.closeButtonPressed
                                }
                                accessibilityRole="button"
                                accessibilityLabel="Close modal"
                            >
                                <Text color="subtle" style={styles.closeButton}>
                                    ✕
                                </Text>
                            </Pressable>
                        </View>

                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        keyboardView: {
            flex: 1,
        },
        scrollContent: {
            paddingVertical: theme.spacing[10],
            paddingHorizontal: theme.spacing[5],
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing[8],
        },
        closeButton: {
            fontSize: 28,
            lineHeight: 32,
        },
        closeButtonPressed: {
            opacity: 0.5,
        },
    }),
);

export const useModalFormStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        section: {
            marginBottom: theme.spacing[6],
        },
        label: {
            ...theme.typography.label,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[2],
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            borderRadius: theme.radii.sm,
            padding: theme.spacing[3],
            ...theme.typography.body,
            backgroundColor: theme.colors.surface.primary,
            color: theme.colors.text.primary,
        },
        hint: {
            ...theme.typography.hint,
            color: theme.colors.text.subtle,
            marginTop: theme.spacing[1],
        },
        typeButtons: {
            flexDirection: "row",
            gap: theme.spacing[3],
        },
        typeButton: {
            flex: 1,
            padding: theme.spacing[3],
            borderRadius: theme.radii.sm,
            alignItems: "center",
            backgroundColor: theme.colors.surface.muted,
            borderWidth: 2,
            borderColor: "transparent",
        },
        typeButtonActiveExpense: {
            backgroundColor: theme.colors.status.expenseSubtle,
            borderColor: theme.colors.status.expenseBorder,
        },
        typeButtonActiveIncome: {
            backgroundColor: theme.colors.status.incomeSubtle,
            borderColor: theme.colors.status.incomeBorder,
        },
        typeButtonText: {
            ...theme.typography.labelSmall,
            color: theme.colors.text.muted,
        },
        typeButtonTextActive: {
            color: theme.colors.text.primary,
        },
        emptyText: {
            ...theme.typography.bodySmall,
            color: theme.colors.text.muted,
            fontStyle: "italic",
        },
    }),
);
