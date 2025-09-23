"use client";

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  Alert,
  useColorScheme,
} from 'react-native';
import { Button } from 'react-native-elements';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { decode } from 'html-entities';
import LocalCalendarModalComponent from '../../../components/local-calendar-modal-component';
import { addCalendarEvent } from '../../../services/LocalCalendarService';
import { COLOR_PRIMARY, BORDER_RADIUS } from "../../../constants/Colors";
import URLs from "../../../constants/URLs";
import { lightStyles, darkStyles } from '../../../constants/sharedStyles';
import { formatEventDateTime, formatEventDescription } from '../../../utils/eventUtils';

export default function AgendaEntryScreen() {
  const { agendaEntry } = useLocalSearchParams<{ agendaEntry: string }>();
  const eventId = Number(agendaEntry);
  const styles = useColorScheme() === 'dark' ? darkStyles : lightStyles;
  const navigation = useNavigation();

  const [isVisibleCalendars, setIsVisibleCalendars] = useState(false);

  const {
    data: event,
    isError,
    isFetched,
  } = useQuery({
    queryKey: ["event", { eventId }],
    queryFn: async () => {
      const response = await fetch(`${URLs.AGENDA_BASE_URL}events/${eventId}`);
      return await response.json();
    },
  });

  useEffect(() => {
    if (isFetched && !isError && event?.title) {
      navigation.setOptions({ title: event.title });
    } else {
      navigation.setOptions({ title: "Loading..." });
    }
  }, [navigation, isFetched, isError, event]);

  const saveButtonClicked = () => {
    setIsVisibleCalendars(true);
  };

  const closeLocalCalendarModal = () => {
    setIsVisibleCalendars(false);
  };

  // Define types for event and calendar
  interface EventDetails {
    title: string;
    description?: string;
    image?: { url: string; height: number; width: number };
    start_date_details: { day: number; month: number; year: number; hour?: number; minutes?: number };
    end_date_details?: { day: number; month: number; year: number; hour?: number; minutes?: number };
    all_day?: boolean;
    venue?: { venue: string };
  }

  const saveEvent = async (calendar: string) => {
    addCalendarEvent(event as EventDetails, calendar,
      () => {
        Alert.alert("Gespeichert", "Der Kalendereintrag wurde gespeichert.", [
          { text: "OK", onPress: closeLocalCalendarModal },
        ]);
      },
      (e: Error) => {
        Alert.alert("Fehler", `Fehler beim Speichern im Kalender: ${e.message}`, [
          { text: "OK", onPress: closeLocalCalendarModal },
        ]);
      }
    );
  };

  // Wrap `saveEvent` to match the expected signature
  const handleCalendarSelection = () => {
    saveEvent('defaultCalendar'); // Replace 'defaultCalendar' with an appropriate default value
  };

  if (isFetched && !isError && event) {
    const containerMargin = 10;
    const contentMarginLeft = 38;
    const dimensions = Dimensions.get('window');
    const imageScaledWidth = dimensions.width - (2 * containerMargin) - contentMarginLeft;

    let imageScaledHeight = 0;
    if (event.image && event.image.height && event.image.width) {
      imageScaledHeight = Math.round(event.image.height * (imageScaledWidth / event.image.width));
    }

    const dateTime = formatEventDateTime(event);
    const description = formatEventDescription(event.description || '');

    return (
      <ScrollView>
        <LocalCalendarModalComponent
          isVisible={isVisibleCalendars}
          closeModal={closeLocalCalendarModal}
          handleCalendarSelected={handleCalendarSelection}
          label="Kalender wählen"
        />
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/CeviLogoTransparent.png")}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{decode(event.title)}</Text>
            <Text style={styles.date}>{dateTime}</Text>
            <Text style={styles.venue}>{decode(event.venue?.venue ?? "")}</Text>
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
            <Button
              style={styles.savebutton}
              onPress={saveButtonClicked}
              icon={{ name: 'save', size: 20, color: 'white' }}
              buttonStyle={{
                backgroundColor: COLOR_PRIMARY,
                width: 140,
                height: 50,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: BORDER_RADIUS,
              }}
              title="Speichern"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}