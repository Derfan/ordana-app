import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
    useBottomSheetModal,
    type BottomSheetBackdropProps,
    type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import {
    type ReactNode,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "../../hooks/use-theme";
import { Text } from "../Text/Text";
import { View } from "../View/View";

/**
 * The imperative handle exposed via `ref` on `AppBottomSheet`.
 * Intentionally minimal — callers only need open/close; everything
 * else (snapToIndex, expand, etc.) can be added here if ever needed.
 */
export interface AppBottomSheetHandle {
    open: () => void;
    close: () => void;
}

/**
 * Creates the ref and named open/close helpers that a parent component passes
 * to `AppBottomSheet`.
 *
 * Usage:
 *   const sheet = useBottomSheetControls();
 *
 *   <Button onPress={sheet.open} label="Add" />
 *   <AddCategorySheet ref={sheet.ref} />
 *
 * Why a hook instead of a plain useRef?
 * - Names the intent at the call site ("controls" vs an anonymous ref).
 * - Removes the need for callers to repeat `.current?.open()` on every press
 *   handler — the helpers are stable callback references.
 * - Co-locates the type so callers never import `AppBottomSheetHandle` directly.
 */
export function useBottomSheetControls() {
    const ref = useRef<AppBottomSheetHandle>(null);

    const open = useCallback(() => {
        ref.current?.open();
    }, []);

    const close = useCallback(() => {
        ref.current?.close();
    }, []);

    return { ref, open, close } as const;
}

export interface AppBottomSheetProps extends Omit<
    BottomSheetModalProps,
    | "ref"
    | "children"
    | "backgroundStyle"
    | "handleIndicatorStyle"
    | "backdropComponent"
> {
    /** Sheet title displayed in the drag-handle header row. */
    title: string;
    children: ReactNode;
    /**
     * When true the close button and pan-to-dismiss are disabled.
     * Use during async operations to prevent accidental dismissal.
     */
    isSubmitting?: boolean;
    /**
     * Snap points passed directly to BottomSheetModal.
     * @default ["85%"]
     */
    snapPoints?: BottomSheetModalProps["snapPoints"];
}

/**
 * Rendered inside the sheet so it can call `useBottomSheetModal().dismiss()`
 * directly — the idiomatic way to dismiss from within the sheet tree.
 * Extracted into its own component so the hook is called inside the modal
 * context (hooks must be called inside the component that is a child of
 * BottomSheetModal, not in the parent that renders it).
 */
function CloseButton({ disabled }: { disabled: boolean }) {
    const theme = useTheme();
    const { dismiss } = useBottomSheetModal();

    return (
        <Pressable
            onPress={() => dismiss()}
            disabled={disabled}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={({ pressed }) => pressed && styles.closeButtonPressed}
            accessibilityRole="button"
            accessibilityLabel="Close"
        >
            <Text
                variant="body"
                colorValue={theme.colors.icon.close}
                style={styles.closeButtonText}
            >
                ✕
            </Text>
        </Pressable>
    );
}

/**
 * Themed bottom-sheet primitive built on @gorhom/bottom-sheet's BottomSheetModal.
 *
 * ### Usage
 * ```tsx
 * const sheet = useBottomSheetControls();
 *
 * <Button onPress={sheet.open} label="+ Add" />
 * <MyFormSheet ref={sheet.ref} />
 * ```
 *
 * ### Design decisions
 * - **Ref-forwarded, not `visible`-driven** — eliminates the `useEffect` bridge
 *   that was syncing declarative boolean state into the imperative sheet API.
 *   Callers call `sheet.open()` / `sheet.close()` directly; no extra re-render.
 * - **`useImperativeHandle`** narrows the exposed surface to `open` / `close`.
 *   The raw `BottomSheetModal` ref stays internal; callers can't accidentally
 *   call `snapToIndex` or `forceClose`.
 * - **`CloseButton` as a sub-component** so it can call `useBottomSheetModal()`
 *   inside the modal's React context — the hook throws if called outside it.
 * - **`BottomSheetScrollView`** instead of `ScrollView` so the sheet's pan
 *   gesture and the scroll gesture are properly coordinated by the library.
 * - **`keyboardBehavior="extend"`** — sheet rises with the keyboard so text
 *   inputs are never hidden; `keyboardBlurBehavior="restore"` returns it to
 *   the snap point when the keyboard closes.
 */
export const AppBottomSheet = forwardRef<
    AppBottomSheetHandle,
    AppBottomSheetProps
>(function AppBottomSheet(
    {
        title,
        children,
        isSubmitting = false,
        snapPoints = ["85%"],
        onDismiss,
        ...sheetProps
    },
    ref,
) {
    const theme = useTheme();
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(
        ref,
        () => ({
            open: () => sheetRef.current?.present(),
            close: () => sheetRef.current?.dismiss(),
        }),
        [],
    );

    const handleDismiss = useCallback(() => {
        onDismiss?.();
    }, [onDismiss]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior={isSubmitting ? "none" : "close"}
            />
        ),
        [isSubmitting],
    );

    const backgroundStyle = {
        backgroundColor: theme.colors.surface.primary,
        borderTopLeftRadius: theme.radii.iconCircle,
        borderTopRightRadius: theme.radii.iconCircle,
    };

    const handleIndicatorStyle = {
        backgroundColor: theme.colors.border.muted,
        width: 40,
        height: 4,
    };

    return (
        <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            onDismiss={handleDismiss}
            enablePanDownToClose={!isSubmitting}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            backgroundStyle={backgroundStyle}
            handleIndicatorStyle={handleIndicatorStyle}
            backdropComponent={renderBackdrop}
            {...sheetProps}
        >
            <BottomSheetScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingHorizontal: theme.spacing[5],
                        paddingBottom: theme.spacing[10],
                    },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View
                    colorValue="transparent"
                    style={[styles.header, { marginBottom: theme.spacing[6] }]}
                >
                    <Text variant="heading2">{title}</Text>
                    <CloseButton disabled={isSubmitting} />
                </View>

                {children}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 22,
        lineHeight: 28,
    },
    closeButtonPressed: {
        opacity: 0.5,
    },
});
