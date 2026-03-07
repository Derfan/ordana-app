import { View } from "@shared/design-system";

import { AccountsList } from "@features/accounts";

export default function AccountsScreen() {
    return (
        <View surface="primary" style={{ flex: 1 }}>
            <AccountsList />
        </View>
    );
}
