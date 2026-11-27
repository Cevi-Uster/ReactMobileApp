import React from 'react';
import { Stack } from 'expo-router';

export default function AgendaStack() {
  return (
    <Stack screenOptions={{ headerTransparent: false, headerShadowVisible: true }}>
      <Stack.Screen 
        name="agendaCategories" 
        options={{
          title: "Kalender"
        }} 
      />
      <Stack.Screen
      name="[agendaEntry]"
      options={{
        title: "Event"
      }}
      />
    </Stack>
  );
};