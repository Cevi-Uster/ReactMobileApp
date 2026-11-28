import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import PrimaryButton from './PrimaryButton';

export function LoadingView() {
  const colors = useThemeColors();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Das hat nicht geklappt</Text>
      <Text style={[styles.message, { color: colors.subtle }]}>
        {message ?? 'Prüfe deine Internetverbindung und versuche es nochmals.'}
      </Text>
      {onRetry ? <PrimaryButton title="Nochmals versuchen" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyView({ message }: { message: string }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={[styles.message, { color: colors.subtle }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
