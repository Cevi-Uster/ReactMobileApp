import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import Ionicons from "react-native-vector-icons/Ionicons";

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
        name="index"
        options={{
          title: 'Willkommen',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/Home_Icon.png")}
              style={[{ resizeMode: "contain" }, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="box/stufen"
        options={{
          title: 'Chäschtli',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bonfire' : 'bonfire-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="box/infobox"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Kontakt',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'at' : 'at-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dataprotectionpolicy"
        options={{
          title: 'Datenschutz',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'shield' : 'shield-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
