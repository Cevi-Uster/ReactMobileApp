import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLOR_PRIMARY } from '@/constants/Colors';

type Props = {
  title: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({ title, onPress, icon, disabled = false, loading = false }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || inactive) && styles.dimmed]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={20} color="white" style={styles.icon} /> : null}
            <Text style={styles.title}>{title}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLOR_PRIMARY,
    minWidth: 140,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimmed: { opacity: 0.6 },
  content: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
  title: { color: 'white', fontSize: 16, fontWeight: '600' },
});
