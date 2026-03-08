import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import {
    Icon,
    Text,
    View,
    createThemedStyles,
    type IconProps,
} from "@shared/design-system";

export default function SettingsScreen() {
    const styles = useStyles();

    return (
        <View surface="page" style={styles.root}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.header}>
                    <Text variant="heading1">Settings</Text>
                </View>

                <View style={styles.menuContainer}>
                    <MenuItem
                        href="/(tabs)/settings/accounts"
                        icon="creditcard.fill"
                        title="Accounts"
                        subtitle="Manage your accounts"
                    />
                    <MenuItem
                        href="/(tabs)/settings/categories"
                        icon="tag.fill"
                        title="Categories"
                        subtitle="Manage your categories"
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

interface MenuItemProps {
    href: Href;
    icon: IconProps["name"];
    title: string;
    subtitle: string;
}

const SPRING = { damping: 15, stiffness: 400, mass: 0.6 } as const;
const SCALE_PRESSED = 0.97;
const OPACITY_PRESSED = 0.75;

function MenuItem({ href, icon, title, subtitle }: MenuItemProps) {
    const styles = useStyles();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        scale.value = withSpring(SCALE_PRESSED, SPRING);
        opacity.value = withSpring(OPACITY_PRESSED, SPRING);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING);
        opacity.value = withSpring(1, SPRING);
    };

    return (
        <Link href={href} asChild>
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Animated.View style={[styles.menuItem, animatedStyle]}>
                    <View style={styles.menuItemLeft}>
                        <Icon name={icon} size={24} color="icon" />
                        <View style={styles.menuItemText}>
                            <Text variant="bodySemibold">{title}</Text>
                            <Text variant="bodySmall" color="muted">
                                {subtitle}
                            </Text>
                        </View>
                    </View>

                    <Icon name="chevron.right" size={20} color="default" />
                </Animated.View>
            </Pressable>
        </Link>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        header: {
            paddingTop: theme.spacing[4],
            paddingHorizontal: theme.spacing[5],
            paddingBottom: theme.spacing[6],
        },
        menuContainer: {
            paddingHorizontal: theme.spacing[5],
            rowGap: theme.spacing[3],
        },
        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: theme.spacing[4],
            paddingHorizontal: theme.spacing[4],
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.bg.page,
        },
        menuItemLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing[4],
        },
        menuItemText: {
            gap: theme.spacing[1],
        },
    }),
);
