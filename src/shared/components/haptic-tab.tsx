import * as Haptics from "expo-haptics";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";

export const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            onPressIn={(ev) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                props.onPressIn?.(ev);
            }}
        />
    );
};
