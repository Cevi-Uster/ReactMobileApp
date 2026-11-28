import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/use-theme-colors';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

export default function Checkbox({ checked, onToggle, label }: Props) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.row}
    >
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={26}
        color={checked ? colors.primary : colors.subtle}
      />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  label: { flex: 1, marginLeft: 10, fontSize: 16 },
});
