import { useTheme } from '@shared/design-system';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.bg.page,
        },
        headerTintColor: theme.colors.fg.default,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="accounts"
        options={{
          title: 'Accounts',
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: 'Categories',
        }}
      />
    </Stack>
  );
}
