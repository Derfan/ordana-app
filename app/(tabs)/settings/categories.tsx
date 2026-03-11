import { CategoriesList } from '@features/categories';
import { View } from '@shared/design-system';

export default function CategoriesScreen() {
  return (
    <View surface="primary" style={{ flex: 1 }}>
      <CategoriesList />
    </View>
  );
}
