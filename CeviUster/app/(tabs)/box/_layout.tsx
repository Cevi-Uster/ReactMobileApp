import React from 'react';
import { Stack } from 'expo-router';
export default function BoxStack() {
  return (
    <Stack screenOptions={{ headerTransparent: false, headerShadowVisible: true }}>
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
