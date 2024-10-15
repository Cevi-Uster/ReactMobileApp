import React from 'react';
import { Stack } from 'expo-router';
export default function AgendaStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="agendaCategories" 
        options={{
          title: "Kalender"
        }} 
      />
    </Stack>
  );
};