import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@constants/theme';
import { useColorScheme } from '@hooks/use-color-scheme';

export default function SettingsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}>
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
