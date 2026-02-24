import { StyleSheet } from 'react-native';

import { ThemedView } from '@components/themed-view';
import { CategoriesList } from '@features/categories';

export default function CategoriesScreen() {
  return (
    <ThemedView  style={styles.container}>
      <CategoriesList />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
