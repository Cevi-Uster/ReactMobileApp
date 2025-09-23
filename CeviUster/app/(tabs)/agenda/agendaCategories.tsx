"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ListItem, Icon } from "react-native-elements";
import { decode } from "html-entities";
import moment from "moment";
import URLs from "../../../constants/URLs";

export default function AgendaScreen() {
  const { agendaId, title } = useLocalSearchParams<{
    agendaId: string;
    title: string;
  }>();

  const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;
  const navigation = useNavigation();

  const [currentParentId, setCurrentParentId] = useState(agendaId ?? "0");

  useEffect(() => {
    navigation.setOptions({
      title: title ?? "Agenda",
    });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <CombinedList parentId={currentParentId} />
    </View>
  );
}

function CombinedList({ parentId = "0" }) {
  const styles = useColorScheme() === "dark" ? darkstyles : lightstyles;

  const {
    data: categoriesData,
    isError: isCategoriesError,
    isFetched: isCategoriesFetched,
  } = useQuery({
    queryKey: ["categories", { parentId }],
    queryFn: async () => {
      const response = await fetch(
        `${URLs.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`
      );
      return await response.json();
    },
  });

  const startDate = moment().format("YYYY-MM-DD 00:00:00");

  const {
    data: eventsData,
    isError: isEventsError,
    isFetched: isEventsFetched,
  } = useQuery({
    queryKey: ["events", { parentId }],
    queryFn: async () => {
      const response = await fetch(
        `${URLs.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${parentId}&per_page=10000`
      );
      return await response.json();
    },
  });

  function onCategoryPressed(item) {
    router.push(`/agenda/agendaCategories?agendaId=${item.id}&title=${item.name}`);
  }

  function onEventPressed(item) {
    router.push({
      pathname: "/agenda/[agendaEntry]",
      params: { agendaEntry: item.id },
    });
  }

  function renderListItem({ item }) {
    if (item.type === "category") {
      return (
        <TouchableOpacity>
          <ListItem
            containerStyle={styles.item}
            bottomDivider
            onPress={() => onCategoryPressed(item)}
          >
            <Icon color={styles.icon.color} name="folder" />
            <ListItem.Content>
              <ListItem.Title style={styles.title}>
                {decode(item.name)}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
      );
    } else if (item.type === "event") {
      const dateText = `${item.start_date_details.day}.${item.start_date_details.month}.${item.start_date_details.year}`;
      let timeText = "";

      if (!item.all_day) {
        timeText += `${item.start_date_details.hour}:${item.start_date_details.minutes}`;
        if (item.end_date_details.hour !== undefined) {
          timeText += ` - ${item.end_date_details.hour}:${item.end_date_details.minutes}`;
        }
      } else {
        timeText = "Ganzer Tag";
      }

      const agendaEntryTitle = `${dateText} ${item.title}`;

      return (
        <TouchableOpacity>
          <ListItem
            containerStyle={styles.item}
            bottomDivider
            onPress={() => onEventPressed(item)}
          >
            <ListItem.Content>
              <ListItem.Title style={styles.title}>
                {decode(agendaEntryTitle)}
              </ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>
                {decode(timeText)}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
      );
    }
    return null;
  }

  if (isCategoriesFetched && isEventsFetched && !isCategoriesError && !isEventsError) {
    const filteredCategories = (categoriesData?.categories || []).filter(
      (category) => category.parent == parentId
    );
    const filteredEvents = (eventsData?.events || []).filter(
      (event) => event.categories.some((cat) => cat.id == parentId)
    );

    const combinedData = [
      ...filteredCategories.map((category) => ({ ...category, type: "category" })),
      ...filteredEvents.map((event) => ({ ...event, type: "event" })),
    ];

    return (
      <FlatList
        style={styles.container}
        data={combinedData}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  return null;
}

// Light theme styles
const lightstyles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "white",
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  icon: {
    color: "black",
  },
  title: {
    fontSize: 16,
    color: "black",
  },
  subtitle: {
    fontSize: 14,
    color: "black",
    marginTop: 2,
  },
});

// Dark theme styles
const darkstyles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "black",
  },
  item: {
    backgroundColor: "black",
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  icon: {
    color: "white",
  },
  title: {
    fontSize: 16,
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginTop: 2,
  },
});
