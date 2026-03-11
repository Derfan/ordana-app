import { AccountsList } from '@features/accounts';
import { View } from '@shared/design-system';

export default function AccountsScreen() {
  return (
    <View surface="primary" style={{ flex: 1 }}>
      <AccountsList />
    </View>
  );
}
