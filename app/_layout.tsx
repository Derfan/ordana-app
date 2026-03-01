import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { ErrorBoundary } from "@components/error-boundary";
import { db } from "@db/client";
import { seedDatabase } from "@db/seed";
import { useColorScheme } from "@hooks/use-color-scheme";

import migrations from "../drizzle/migrations";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isSeeded, setIsSeeded] = useState(false);

    const { success, error } = useMigrations(db, migrations);

    useEffect(() => {
        if (success && !isSeeded) {
            seedDatabase()
                .then(() => {
                    console.log("[App] Database seeded successfully");
                    setIsSeeded(true);
                })
                .catch((err) => {
                    console.error("[App] Seeding failed:", err);
                    setIsSeeded(true);
                });
        }
    }, [success, isSeeded]);

    if (error) {
        console.error("Migration error:", error);
    }

    if (!success || !isSeeded) return null;

    return (
        <ErrorBoundary>
            <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal", title: "Modal" }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </ErrorBoundary>
    );
}
