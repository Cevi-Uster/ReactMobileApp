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

export default function AgendaEntryScreen() {
  const { agendaEntry } = useLocalSearchParams<{ agendaEntry: string }>();
  const eventId = Number(agendaEntry);
  const styles = useColorScheme() === 'dark' ? darkstyles : lightstyles;
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

  const saveEvent = async (calendar) => {
    addCalendarEvent(event, calendar,
      () => {
        Alert.alert("Gespeichert", "Der Kalendereintrag wurde gespeichert.", [
          { text: "OK", onPress: closeLocalCalendarModal },
        ]);
      },
      (e) => {
        Alert.alert("Fehler", `Fehler beim Speichern im Kalender: ${e}`, [
          { text: "OK", onPress: closeLocalCalendarModal },
        ]);
      }
    );
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

    let dateTime = `${event.start_date_details.day}.${event.start_date_details.month}.${event.start_date_details.year}`;
    if (!event.all_day) {
      dateTime += ` ${event.start_date_details.hour}:${event.start_date_details.minutes}`;
    }
    if (event.end_date_details) {
      dateTime += ` - ${event.end_date_details.day}.${event.end_date_details.month}.${event.end_date_details.year}`;
      if (!event.all_day) {
        dateTime += ` ${event.end_date_details.hour}:${event.end_date_details.minutes}`;
      }
    }

    const description = decode((event.description || "").replace(/<(.|\n)*?>/g, ''));

    return (
      <ScrollView>
        <LocalCalendarModalComponent
          isVisible={isVisibleCalendars}
          closeModal={closeLocalCalendarModal}
          handleCalendarSelected={saveEvent}
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

const lightstyles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60,
  },
  content: {
    marginTop: 5,
    marginLeft: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0097fe',
  },
  venue: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
  },
  image: {
    marginTop: 5,
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savebutton: {
    marginTop: 10,
  },
});

const darkstyles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60,
  },
  content: {
    marginTop: 5,
    marginLeft: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0097fe',
  },
  venue: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
    color: '#ffffff',
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: '#ffffff',
  },
  image: {
    marginTop: 5,
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savebutton: {
    marginTop: 10,
  },
});
