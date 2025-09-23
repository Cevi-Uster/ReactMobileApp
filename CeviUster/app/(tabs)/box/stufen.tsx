"use client";

import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'html-entities';
import URLs from '../../../constants/URLs';

export default function Stufen() {
  const [currentParentStufenId, setcurrentParentStufenId] = useState(-1);
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkstyles : lightstyles;

  const {
    data: stufen,
    isError,
    isPending,
    isFetched,
  } = useQuery({
    queryKey: ['stufen', { currentParentStufenId }],
    queryFn: async () => {
      const response = await fetch(`${URLs.INFOBOX_BASE_URL}stufen/`);
      return await response.json();
    },
  });

  const onStufePressed = (item) => {
    console.log(item);
    router.push(
      `/box/infobox?parentStufe=${item.stufen_id}&title=${encodeURIComponent(item.name)}`
    );
  };

  const renderListItem = ({ item, index, separators }) => {
    if (typeof item.name !== 'undefined') {
      return (
        <TouchableOpacity>
          <ListItem
            containerStyle={styles.item}
            bottomDivider
            onPress={() => onStufePressed(item)}
          >
            <Avatar
              avatarStyle={styles.avatar}
              source={require('../../../assets/images/Home_Icon.png')}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.title}>
                {decode(item.name)}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stufen}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const lightstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'white',
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  avatar: {
    tintColor: 'black',
  },
  title: {
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
  },
});

const darkstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  item: {
    backgroundColor: 'black',
    padding: 12,
    paddingBottom: 15,
    paddingTop: 15,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  avatar: {
    tintColor: 'white',
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
  },
});
