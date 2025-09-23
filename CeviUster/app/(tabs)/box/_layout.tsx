import React from 'react';
import { Stack } from 'expo-router';
export default function BoxStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="stufen" 
        options={{
          title: "Stufen"
        }} 
      />
      <Stack.Screen name="infobox" />
    </Stack>
  );
};
