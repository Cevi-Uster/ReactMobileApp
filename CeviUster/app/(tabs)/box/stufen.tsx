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
import { lightStyles, darkStyles } from '../../../constants/sharedStyles';
import { fetchStufenData } from '../../../services/box/stufenService';

export default function Stufen() {
  const [currentParentStufenId, setcurrentParentStufenId] = useState(-1);
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const {
    data: stufen,
    isError,
    isPending,
    isFetched,
  } = useQuery<Stufe[]>({
    queryKey: ['stufen', { currentParentStufenId }],
    queryFn: () => fetchStufenData(),
  });

  if (isError) {
    console.error('Error fetching stufen data');
  }

  // Define types for `item` and other parameters
  interface Stufe {
    stufen_id: number;
    name: string;
  }

  const onStufePressed = (item: Stufe) => {
    console.log(item);
    router.push(
      `/box/infobox?parentStufe=${item.stufen_id}&title=${encodeURIComponent(item.name)}`
    );
  };

  const renderListItem = ({ item, index, separators }: { item: Stufe; index: number; separators: any }) => {
    if (typeof item.name !== 'undefined') {
      return (
        <TouchableOpacity>
          <ListItem
            containerStyle={styles.tableItem}
            bottomDivider
            onPress={() => onStufePressed(item)}
          >
            <Avatar
              avatarStyle={styles.avatar}
              source={require('../../../assets/images/Home_Icon.png')}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle}>
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
    <View style={styles.tableContainer}>
      <FlatList
        data={stufen || []}
        renderItem={renderListItem}
        keyExtractor={(item) => item.stufen_id.toString()}
      />
    </View>
  );
}
