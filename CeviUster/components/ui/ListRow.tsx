import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/use-theme-colors';

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  onPress: () => void;
};

export default function ListRow({ title, subtitle, left, onPress }: Props) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.subtle }]}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.subtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: { opacity: 0.6 },
  left: { marginRight: 14 },
  content: { flex: 1 },
  title: { fontSize: 16 },
  subtitle: { fontSize: 14, marginTop: 2 },
});
