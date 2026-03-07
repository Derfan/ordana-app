import { Stack } from "expo-router";

import { useTheme } from "@shared/design-system";

export default function SettingsLayout() {
    const theme = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface.primary,
                },
                headerTintColor: theme.colors.text.primary,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Settings",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="accounts"
                options={{
                    title: "Accounts",
                }}
            />
            <Stack.Screen
                name="categories"
                options={{
                    title: "Categories",
                }}
            />
        </Stack>
    );
}
