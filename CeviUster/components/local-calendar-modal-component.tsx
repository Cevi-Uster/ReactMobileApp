import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Calendar, listCalendars } from '../services/agenda/localCalendarService';

type Props = {
  isVisible?: boolean;
  closeModal?: () => void;
  handleCalendarSelected?: (calendar: Calendar) => void;
  label?: string;
};

function LocalCalendarModalComponent({
  isVisible = false,
  closeModal = () => {},
  handleCalendarSelected = () => {},
  label = 'Kalender wählen',
}: Props) {
  const colors = useThemeColors();
  const { data, isFetching, error } = useQuery({
    queryKey: ['local-calendars'],
    queryFn: async () => (await listCalendars()).filter((c) => c.allowsModifications),
    enabled: isVisible,
    gcTime: 0,
    retry: false,
  });
  const calendars = data ?? [];
  const loading = isFetching;
  const errorMessage = error?.message;

  return (
    <Modal transparent visible={isVisible} onRequestClose={closeModal} animationType="slide">
      <TouchableWithoutFeedback accessible={false} onPress={closeModal}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.body, { backgroundColor: colors.background }]}>
              <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
              {loading ? <ActivityIndicator color={colors.primary} style={styles.status} /> : null}
              {errorMessage ? <Text style={[styles.status, { color: colors.error }]}>{errorMessage}</Text> : null}
              {!loading && !errorMessage && calendars.length === 0 ? (
                <Text style={[styles.status, { color: colors.subtle }]}>Keine beschreibbaren Kalender gefunden.</Text>
              ) : null}
              <ScrollView>
                {calendars.map((calendar) => (
                  <TouchableOpacity
                    key={calendar.id}
                    accessibilityRole="button"
                    onPress={() => handleCalendarSelected(calendar)}
                    style={styles.entry}
                  >
                    <View style={[styles.circle, { backgroundColor: calendar.color }]} />
                    <Text style={[styles.entryText, { color: colors.text }]}>{calendar.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  body: { flexShrink: 1, padding: 12, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  status: { marginVertical: 10 },
  entry: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  entryText: { fontSize: 16, marginLeft: 10, flexShrink: 1 },
  circle: { width: 12, height: 12, borderRadius: 6 },
});

export default LocalCalendarModalComponent;
