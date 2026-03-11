import { BalanceSummaryCard } from '@features/analytics';
import { AddTransactionModal, RecentTransactionsList } from '@features/transactions';
import { useTransactionMethods } from '@hooks/use-transactions';
import { Button, createThemedStyles, Icon, Text } from '@shared/design-system';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = useStyles();

  const { addTransaction } = useTransactionMethods();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text variant="heading1">Home</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews
      >
        <BalanceSummaryCard />

        <Button
          label="Add Transaction"
          leftIcon={<Icon name="plus" color="default" size={20} />}
          onPress={() => setIsModalVisible(true)}
        />

        <View style={styles.section}>
          <Text variant="subtitle">Recent Transactions</Text>
          <RecentTransactionsList />
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={addTransaction}
      />
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
    section: {
      rowGap: theme.spacing[3],
    },
  }),
);
