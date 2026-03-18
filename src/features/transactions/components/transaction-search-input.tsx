import { createThemedStyles } from '@shared/design-system';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const TransactionSearchInput = () => {
  const styles = useStyles();

  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { textAlign: isFocused ? 'left' : 'center' }]}
        placeholder="Search transactions"
        value={searchText}
        onChangeText={setSearchText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const useStyles = createThemedStyles((theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border.brand,
      borderRadius: theme.radii.md,
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.bg.page,
    },
    input: {
      ...theme.typography.body,
      color: theme.colors.fg.default,
      paddingVertical: theme.spacing[3],
    },
  }),
);
