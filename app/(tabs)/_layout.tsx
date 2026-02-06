import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

//import { Stack } from 'expo-router';

// export default function TabsLayout() {
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ title: "Home" }} />
//       <Stack.Screen name="explore" options={{ title: "Explore" }} />
//       <Stack.Screen
//         name="create-meal"
//         options={{
//           title: "Create Meal",
//           headerBackVisible: false
//         }}
//       />
//     </Stack>
//   );
// }


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="food-bank" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="folder.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
