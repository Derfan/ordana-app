import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import {
    AddTransactionModal,
    RecentTransactionsList,
} from "@features/transactions";
import { BalanceSummaryCard } from "@features/analytics";
import { useTransactionMethods } from "@hooks/use-transactions";
import { createThemedStyles, Text, Button, Icon } from "@shared/design-system";

export default function HomeScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const styles = useStyles();

    const { addTransaction } = useTransactionMethods();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            removeClippedSubviews
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text variant="heading1">Home</Text>

                    <BalanceSummaryCard />

                    <Button
                        label="Add Transaction"
                        leftIcon={
                            <Icon name="plus" color="default" size={20} />
                        }
                        onPress={() => setIsModalVisible(true)}
                    />

                    <RecentTransactionsList />

                    <AddTransactionModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        onSubmit={addTransaction}
                    />
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const useStyles = createThemedStyles((theme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        content: {
            flex: 1,
            rowGap: theme.spacing[5],
            marginHorizontal: theme.spacing[4],
        },
    }),
);
