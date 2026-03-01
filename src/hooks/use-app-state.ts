import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Hook for triggering a callback when the app becomes active (comes to foreground).
 * Useful for refreshing data when the user returns to the app.
 *
 * @param callback - Function to call when the app becomes active
 */
export function useAppStateActive(callback: () => void) {
    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (state: AppStateStatus) => {
                if (state === "active") {
                    callback();
                }
            },
        );

        return () => {
            subscription.remove();
        };
    }, [callback]);
}
