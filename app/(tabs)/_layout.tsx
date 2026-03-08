import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@components/haptic-tab";
import { useTheme, Icon } from "@/shared/design-system";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:
                    theme.colors.interactive.primary.background,
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Icon size={28} name="house.fill" colorValue={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <Icon size={28} name="clock.fill" colorValue={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Analytics",
                    tabBarIcon: ({ color }) => (
                        <Icon
                            size={28}
                            name="chart.bar.fill"
                            colorValue={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={({ route }) => ({
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Icon
                            size={28}
                            name="gearshape.fill"
                            colorValue={color}
                        />
                    ),
                    tabBarStyle:
                        ((route as any).state?.index ?? 0) > 0
                            ? { display: "none" }
                            : undefined,
                })}
            />
        </Tabs>
    );
}
