import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionsList } from "@features/transactions";
import { createThemedStyles, Text } from "@shared/design-system";

export default function HistoryScreen() {
    const styles = useStyles();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text variant="heading1">History</Text>
            </View>

            <View style={styles.content}>
                <TransactionsList />
            </View>
        </SafeAreaView>
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
    }),
);
