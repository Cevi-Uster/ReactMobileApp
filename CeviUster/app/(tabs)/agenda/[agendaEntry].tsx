"use client";

import React from 'react';
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, ScrollView, View, Text, Image, Dimensions, Alert, useColorScheme } from 'react-native';
import { Button } from 'react-native-elements';
import {COLOR_PRIMARY, COLOR_SECONDARY, BORDER_RADIUS} from "../../../constants/Colors";
import {decode} from 'html-entities';
import LocalCalendarModalComponent from '../../../components/LocalCalendarModalComponent';
import {addCalendarEvent} from '../../../services/LocalCalendarService';
import URLs from "../../../constants/URLs";
import { isLoaded } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function AgendaEntryScreen() {

  let containerMargin = 10;
  let contentMarginLeft = 38;

  const styles = useColorScheme() === 'dark' ? darkstyles : lightstyles;

    const param = ({
        // ID des events
        agendaEntry,
    } = useLocalSearchParams<{ agendaEntry : string}>());

    console.log("EventId: "+ param.agendaEntry);
    const [eventId, setEventId] = useState(Number(param.agendaEntry));
    console.log("EventId: "+ eventId);
    
    const [isVisibleCalendars, setIsVisibleCalendars] = useState(false);

    const navigation = useNavigation();

    const {
      data: event,
      isError,
      isPending,
      isFetched,
    } = useQuery({
      queryKey: ["event", { eventId }],
      queryFn: async () => {
        const response = await fetch(`${URLs.AGENDA_BASE_URL}events/${eventId}`);
        return (await response.json() as object);
      },
    });
  
  function saveButtonClicked(){
    setIsVisibleCalendars(true);
  }

  function closeLocalCalendarModal(){
    setIsVisibleCalendars(false);
  }

  saveEvent = async (calendar) => { 
    console.log('saveEvent: ' + event + ' to calendar: ' + calendar );
    
    addCalendarEvent(event, calendar, () => {
      Alert.alert(
        "Gespeichert",
        "Der Kalendereintrag wurde gespeichert.",
        [
          { text: "OK", onPress: () => closeLocalCalendarModal() }
        ]
      )
    }, (e) => {
      Alert.alert(
        "Fehler",
        "Fehler beim Speichern im Kalender: " + e,
        [
          { text: "OK", onPress: () => closeLocalCalendarModal() }
        ]
      )
    });
  };

  if(isFetched && !isError){
    navigation.setOptions({
      title: event.title,
  });
    //const event = this.state.event;
    //console.log("event: "+ JSON.stringify(event))
    let dateTime = '';
    dateTime = `${event.start_date_details.day}.${event.start_date_details.month}.${event.start_date_details.year}`;
    if (!event.all_day){
      dateTime = `${dateTime} ${event.start_date_details.hour}:${event.start_date_details.minutes}`;
    }
    if (event.end_date_details !== undefined) {
      dateTime= `${dateTime} - ${event.end_date_details.day}.${event.end_date_details.month}.${event.end_date_details.year}`
    }
    if (!event.all_day){
      dateTime = `${dateTime} ${event.end_date_details.hour}:${event.end_date_details.minutes}`;
    }

    if (event.description == ''){
      styles.description.display = 'none';
    }

    const dimensions = Dimensions.get('window');
    let imageScaledWidth = dimensions.width - (2 * containerMargin) - contentMarginLeft;
    let imageScaledHeight = 0;
    console.log(`event.image ${event.image}`);
    if (event.image == false){
      styles.image.display = 'none';
    } else {
      imageScaledHeight = Math.round(event.image.height * (imageScaledWidth  / event.image.width));
    }
    console.log(`containerMargin ${containerMargin}`);
    console.log(`contentMarginLeft ${contentMarginLeft}`);
    console.log(`event.image.height ${event.image.height}`);
    console.log(`imageScaledWidth ${imageScaledWidth}`);
    console.log(`event.image.width ${event.image.width}`);
    console.log(`ìmageScaledHeight ${imageScaledHeight}`);

    let description = decode(event.description.replace(/<(.|\n)*?>/g, ''));

    return (
      <ScrollView>
        <LocalCalendarModalComponent
          isVisible={isVisibleCalendars}
          closeModal={() => closeLocalCalendarModal()}
          handleCalendarSelected={(calendar) => saveEvent(calendar)}
          label={'Kalender wählen'}
        />
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/CeviLogoTransparent.png")}
          />
          <View style={styles.content}>
            <Text
              style={styles.title}>
              {decode(event.title)}
            </Text>
            <Text
              style={styles.date}>
              {dateTime}
            </Text>
            <Text
              style={styles.venue}>
              {decode(event.venue.venue)}
            </Text>
          <Text
            style={styles.description}>
            {description}
          </Text>
          <Image
            style={styles.image}
            source={{uri: event.image.url}}
            resizeMode='contain'
            width={imageScaledWidth}
            height={imageScaledHeight}
            >
          </Image>
          </View>
          <View style={styles.buttonview}>
            <Button
              style={styles.savebutton}
              onPress={() => {saveButtonClicked()}}
              icon={{
                name: 'save',
                size: 20,
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: COLOR_PRIMARY,
                width: 140,
                height: 50,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: BORDER_RADIUS
              }}
              title='Speichern'
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}


const lightstyles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60
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
    marginTop:5,
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  savebutton: {
    marginTop:10,
  }
});

const darkstyles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60
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
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: '#ffffff',
  },
  image: {
    marginTop:5,
  },
  buttonview: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  savebutton: {
    marginTop:10,
  }
});
