import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import URLs from '../../constants/URLs';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="webview"
        options={{
          title: 'Welcome',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/Home_Icon.png")}
              style={[{ resizeMode: "contain" }, { tintColor: color }]}
            />
          ),
          href: {
            pathname: '/webview/?url=[url]',
            params: {
              url: URLs.WELCOME_URL,
            },
          },
        }}
      />
      
    </Tabs>
  );
}
