import { Tabs } from "expo-router";

import { useTheme, Icon } from "@/shared/design-system";
import { HapticTab } from "@shared/components";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.accent.brand,
                tabBarStyle: {
                    backgroundColor: theme.colors.bg.elevated,
                    borderTopLeftRadius: theme.radii.md,
                    borderTopRightRadius: theme.radii.md,
                },
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            size={28}
                            name={focused ? "house.fill" : "house"}
                            colorValue={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            size={28}
                            name={focused ? "clock.fill" : "clock"}
                            colorValue={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Analytics",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            size={28}
                            name={focused ? "chart.pie.fill" : "chart.pie"}
                            colorValue={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            size={28}
                            name={focused ? "gearshape.fill" : "gearshape"}
                            colorValue={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
