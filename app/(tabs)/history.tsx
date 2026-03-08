import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionsList } from "@features/transactions";
import { createThemedStyles, Text } from "@shared/design-system";

export default function HistoryScreen() {
    const styles = useStyles();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                <Text variant="heading1">History</Text>

                <TransactionsList />
            </View>
        </SafeAreaView>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        content: {
            rowGap: theme.spacing[5],
            marginHorizontal: theme.spacing[3],
        },
    }),
);
