import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionsList } from '@features/transactions';
import { useThemeColor } from '@hooks/use-theme-color';

export default function HistoryScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <TransactionsList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
