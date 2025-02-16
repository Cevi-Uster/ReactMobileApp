"use client";

import React, { useState } from 'react';
import { FlatList, StyleSheet,  Text, TouchableOpacity, View, StatusBar, useColorScheme } from 'react-native';
import { Avatar, List, ListItem, Icon} from 'react-native-elements';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { useQuery } from "@tanstack/react-query";
import { decode } from 'html-entities';
import URLs from '../../../constants/URLs';

export default function Stufen() {


  const [currentParentStufenId, setcurrentParentStufenId] = useState(-1);
 
  const styles = useColorScheme() === 'dark' ? darkstyles : lightstyles;
  
  const {
    data: stufen,
    isError,
    isPending,
    isFetched,
  } = useQuery({
    queryKey: ["stufen", { currentParentStufenId }],
    queryFn: async () => {
      const response = await fetch(`${URLs.INFOBOX_BASE_URL}stufen/`);
      return (await response.json());
    },
  });

  function onStufePressed(item) {
    console.log(item);
    router.push('/box/infobox?parentStufe=' + item.stufen_id + '&title=' + item.name);
  }
  
  renderListItem = ({ item, index, separators }) => {
    if (typeof item.name !== 'undefined') {
      return (<TouchableOpacity>
        <ListItem containerStyle={styles.item}
          bottomDivider
          onPress={ () => onStufePressed(item)}>
          <Avatar avatarStyle={styles.avatar} source={require('../../../assets/images/Home_Icon.png')} />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>{decode(item.name)}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>)
    }
    return null;
  }

    console.log('render stufen = ' + stufen);
    //const styles = require('../../../constants/ViewStyles');
    return (
      <View style={styles.container}>
        <FlatList
          data={stufen}
          renderItem={renderListItem.bind(stufen)}
          keyExtractor={(item, index) => ''+ index}
          //extraData={this.state}
        />
      </View>
    )
}

const lightstyles = StyleSheet.create({
  container: {
    flex: 0,
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
    flex: 0,
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