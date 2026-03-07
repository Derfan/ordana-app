import { View } from "@shared/design-system";

import { CategoriesList } from "@features/categories";

export default function CategoriesScreen() {
    return (
        <View surface="primary" style={{ flex: 1 }}>
            <CategoriesList />
        </View>
    );
}
