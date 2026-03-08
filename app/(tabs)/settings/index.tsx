import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    createAnimatedComponent,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import {
    createThemedStyles,
    useTheme,
    Icon,
    Text,
    Box,
} from "@shared/design-system";
import type { IconProps } from "@shared/design-system";

export default function SettingsScreen() {
    const styles = useStyles();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text variant="heading1">Settings</Text>
            </View>

            <View style={styles.content}>
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
            </View>
        </SafeAreaView>
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

const AnimatedBox = createAnimatedComponent(Box);

function MenuItem({ href, icon, title, subtitle }: MenuItemProps) {
    const theme = useTheme();
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
                <AnimatedBox
                    style={animatedStyle}
                    radius={theme.radii.md}
                    surface="elevated"
                    direction="row"
                    align="center"
                    justify="space-between"
                    padding="sm"
                >
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
                </AnimatedBox>
            </Pressable>
        </Link>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        safeArea: {
            flexGrow: 1,
        },
        header: {
            marginVertical: theme.spacing[1],
            paddingHorizontal: theme.spacing[2],
        },
        content: {
            rowGap: theme.spacing[4],
            paddingHorizontal: theme.spacing[2],
            paddingVertical: theme.spacing[4],
        },
        menuContainer: {
            rowGap: theme.spacing[3],
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
