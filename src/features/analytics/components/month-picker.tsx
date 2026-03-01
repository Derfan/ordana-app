import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@components/themed-text";

interface MonthPickerProps {
    year: number;
    month: number; // 0-indexed
    onChange: (year: number, month: number) => void;
    /** Prevent navigating past the current month */
    maxDate?: Date;
}

function formatMonthLabel(year: number, month: number): string {
    return new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function isAtMax(year: number, month: number, maxDate: Date): boolean {
    return (
        year > maxDate.getFullYear() ||
        (year === maxDate.getFullYear() && month >= maxDate.getMonth())
    );
}

export function MonthPicker({ year, month, onChange, maxDate }: MonthPickerProps) {
    const now = maxDate ?? new Date();
    const canGoForward = !isAtMax(year, month, now);

    const handlePrev = () => {
        if (month === 0) {
            onChange(year - 1, 11);
        } else {
            onChange(year, month - 1);
        }
    };

    const handleNext = () => {
        if (!canGoForward) return;
        if (month === 11) {
            onChange(year + 1, 0);
        } else {
            onChange(year, month + 1);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={handlePrev}
                style={({ pressed }) => [styles.arrow, pressed && styles.arrowPressed]}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
            >
                <ThemedText style={styles.arrowText}>‹</ThemedText>
            </Pressable>

            <ThemedText style={styles.label}>
                {formatMonthLabel(year, month)}
            </ThemedText>

            <Pressable
                onPress={handleNext}
                disabled={!canGoForward}
                style={({ pressed }) => [
                    styles.arrow,
                    pressed && canGoForward && styles.arrowPressed,
                    !canGoForward && styles.arrowDisabled,
                ]}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Next month"
            >
                <ThemedText style={[styles.arrowText, !canGoForward && styles.arrowTextDisabled]}>
                    ›
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        textAlign: "center",
    },
    arrow: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
    },
    arrowPressed: {
        opacity: 0.5,
    },
    arrowDisabled: {
        opacity: 0.25,
    },
    arrowText: {
        fontSize: 28,
        lineHeight: 32,
        fontWeight: "300",
    },
    arrowTextDisabled: {
        opacity: 0.4,
    },
});
