import { StyleSheet } from "react-native";

import { ThemedView } from "@components/themed-view";
import { AccountsList } from "@features/accounts";

export default function AccountsScreen() {
    return (
        <ThemedView style={styles.container}>
            <AccountsList />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
