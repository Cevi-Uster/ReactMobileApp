import React from 'react';
import { Stack } from 'expo-router';
export default function AgendaStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="agenda" 
        options={{
          title: "Kalender"
        }} 
      />
    </Stack>
  );
};