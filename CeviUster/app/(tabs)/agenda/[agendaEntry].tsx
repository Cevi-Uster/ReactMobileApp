import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, useColorScheme, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'html-entities';
import LocalCalendarModalComponent from '../../../components/local-calendar-modal-component';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { ErrorView, LoadingView } from '@/components/ui/StateView';
import { Calendar, CalendarEventInput, addCalendarEvent } from '../../../services/agenda/localCalendarService';
import { fetchJson } from '../../../services/http';
import URLs from '../../../constants/URLs';
import { lightStyles, darkStyles } from '../../../constants/sharedStyles';
import { EventDates, formatEventDateTime, formatEventDescription } from '../../../utils/eventUtils';

interface EventDetails extends EventDates, CalendarEventInput {
  image?: { url: string; height: number; width: number };
}

export default function AgendaEntryScreen() {
  const { agendaEntry } = useLocalSearchParams<{ agendaEntry: string }>();
  const eventId = Number(agendaEntry);
  const styles = useColorScheme() === 'dark' ? darkStyles : lightStyles;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [isVisibleCalendars, setIsVisibleCalendars] = useState(false);

  const { data: event, isPending, isError, error, refetch } = useQuery({
    queryKey: ['event', { eventId }],
    queryFn: () => fetchJson<EventDetails>(`${URLs.AGENDA_BASE_URL}events/${eventId}`),
  });

  useEffect(() => {
    navigation.setOptions({ title: event?.title ? decode(event.title) : 'Event' });
  }, [navigation, event?.title]);

  const closeLocalCalendarModal = () => setIsVisibleCalendars(false);

  const saveEvent = (calendar: Calendar) => {
    if (!event) return;
    addCalendarEvent(
      event,
      calendar,
      () => {
        Alert.alert('Gespeichert', 'Der Kalendereintrag wurde gespeichert.', [
          { text: 'OK', onPress: closeLocalCalendarModal },
        ]);
      },
      (e) => {
        Alert.alert('Fehler', `Fehler beim Speichern im Kalender: ${e.message}`, [
          { text: 'OK', onPress: closeLocalCalendarModal },
        ]);
      }
    );
  };

  if (isPending) return <LoadingView />;
  if (isError) return <ErrorView message={error.message} onRetry={() => refetch()} />;

  const containerMargin = 10;
  const contentMarginLeft = 38;
  const imageScaledWidth = width - 2 * containerMargin - contentMarginLeft;
  const imageScaledHeight =
    event.image?.height && event.image?.width
      ? Math.round(event.image.height * (imageScaledWidth / event.image.width))
      : 0;

  const description = formatEventDescription(event.description || '');

  return (
    <ScrollView>
      <LocalCalendarModalComponent
        isVisible={isVisibleCalendars}
        closeModal={closeLocalCalendarModal}
        handleCalendarSelected={saveEvent}
        label="Kalender wählen"
      />
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../../assets/images/CeviLogoTransparent.png')} />
        <View style={styles.content}>
          <Text style={styles.title}>{decode(event.title)}</Text>
          <Text style={styles.date}>{formatEventDateTime(event)}</Text>
          <Text style={styles.venue}>{decode(event.venue?.venue ?? '')}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          {event.image?.url ? (
            <Image
              style={styles.image}
              source={{ uri: event.image.url }}
              resizeMode="contain"
              width={imageScaledWidth}
              height={imageScaledHeight}
            />
          ) : null}
        </View>
        <View style={styles.buttonview}>
          <PrimaryButton title="Speichern" icon="save-outline" onPress={() => setIsVisibleCalendars(true)} />
        </View>
      </View>
    </ScrollView>
  );
}
