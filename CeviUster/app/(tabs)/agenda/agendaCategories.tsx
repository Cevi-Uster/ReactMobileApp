"use client";

import React from 'react';
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { decode } from 'html-entities';
import moment from 'moment';
import URLs from "../../../constants/URLs";

export default function AgendaScreen() {

    const param = ({
        // ID der agenda
        agendaId,
        // Name der Stufe für die Anzeige im Titel
        title,
    } = useLocalSearchParams<{ agendaId: string ; title: string }>());

    console.log("AgendaScreen ParentId: "+ param.agendaId);

  const [currentParentId, setCurrentParentId] = useState(param.agendaId);

  if(currentParentId == undefined){
    setCurrentParentId('0');
    console.log("AgendaScreen ParentId = 0");
  }
  console.log("AgendaScreen ParentId: "+ param.agendaId);
  /*const navigation = useNavigation();
  useLayoutEffect(() => {
    if(!param.title){
        navigation.setOptions({
            title: "Agenda",
        });
    }else{
      navigation.setOptions({
          title: param.title,
      });
    }
  }, [navigation]);*/

    return (
      <View style={styles.container}>
        <Categories categorieParentId={currentParentId}/>
        <Events eventParentId={currentParentId}/>       
      </View>
    )
} // end of function component

function Categories({categorieParentId}){
  const [categories, setCategories] = useState([]);

  console.log("Enter Categories: "+ JSON.stringify(categorieParentId));
  if(categorieParentId == null){
    categorieParentId = 0;
  }

  const {
    data: json,
    isError,
    isPending,
    isFetched,
  } = useQuery({
    queryKey: ["categorieParentId", { categorieParentId }],
    queryFn: async () => {
      const response = await fetch(`${URLs.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`);
      return (await response.json());
    },
  });

    function onCategoryPressed(item){
      console.log('onCategoryPressed: selectedItem: ' + item.id + ', ' + item.name);
      //console.log('navigation: ' + navigation);
      /*this.props.navigation.push('Agenda', {
       parentCategory: item, 
       title: item.name
     });*/
     //setData([]);
     router.push('/agenda/agendaCategories?agendaId=' + item.id + '&title=' + item.name);
     //setCurrentParentId(item.id);
     //setComponentState(states.requestData);
   }

  renderListItem = ({ item, index, separators }) => {
    //console.log('renderListItem: ' + JSON.stringify(item));
    if (typeof item.name !== 'undefined') {
      console.log('render category');
      // Handle category
      return (<TouchableOpacity>
        <ListItem 
          bottomDivider
          onPress={ () => onCategoryPressed(item)}>
          <Icon name={'folder'}/>
          <ListItem.Content>
            <ListItem.Title>{decode(item.name)}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>)
    } else {
      console.log('render unknown item ' + item);
    }
  };
  if(isFetched && !isError){

    console.log("categorie json: "+ JSON.stringify(json) );
    //console.log(json.categories);
    //if (json !== undefined && json !== null && json.categories !== undefined && json.categories !== null){
      const filteredCategories = json.categories.filter(category => category.parent == categorieParentId);
      console.log(filteredCategories);
      //setCategories(filteredCategories);
      //const newData = data;
      //Array.prototype.unshift.apply(newData, filteredCategories);
      //setData(newData);
      console.log('filteredCategories = ' + filteredCategories);
    //} else {
      //setCategories(new Array(0));
    //}

    if(filteredCategories != ""){
    return (
      
      <FlatList
      style={styles.container}
      data={filteredCategories}
      renderItem={renderListItem.bind(filteredCategories)}
      keyExtractor={(item, index) => ''+ index}
      //extraData={data}
    />
  )}};
}

function Events({eventParentId}){
  const [events, setEvents] = useState([]);

  //if(eventParentId == null || eventParentId == undefined || eventParentId == Number.NaN){
    //eventParentId = 11;
  //}

  console.log("Enter Events: "+ eventParentId);

  const startDate = moment().format("YYYY-MM-DD 00:00:00");

  let uri:string = `${URLs.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${eventParentId}&per_page=10000`;
  console.log(uri);
  

  console.log("Parent id: "+eventParentId);

  const {
    data: json,
    isError,
    isPending,
    isFetched,
    
  } = useQuery({
    queryKey: ["events", { eventParentId }],
    queryFn: async () => {
      const response = await fetch(uri);
      return (await response.json());
    },
  });

  function onEventPressed(item){
    console.log("onEventPressed: item: "+item.id);
    //this.props.navigation.navigate('AgendaEntry', {selectedEvent: item});
    router.push({
     pathname: "/agenda/[agendaEntry]",
     params: { agendaEntry: item.id },
   })
    //router.push('/agenda/[agendaEntry]/${item.id}');
 }

  renderListItem = ({ item, index, separators }) => {
    //console.log('renderListItem: ' + JSON.stringify(item));
    if (typeof item.title !== 'undefined') {
      console.log('render event: '+ item.title + ' / ' + item.id);
      // Handle event
      let dateText = `${item.start_date_details.day}.${item.start_date_details.month}.${item.start_date_details.year}`;
      let timeText = ``;
      if (!item.all_day){
        timeText +=  `${item.start_date_details.hour}:${item.start_date_details.minutes}`;
        if (item.end_date_details.hour !== undefined){
          timeText += ` - ${item.end_date_details.hour}:${item.end_date_details.minutes}`;
        }
      }  else {
        timeText += `Ganzer Tag`;
      }
      let agendaEntryTitle = dateText + ' ' + item.title
      return (<TouchableOpacity>
        <ListItem 
          bottomDivider
          onPress={ () => onEventPressed(item)}>
          <ListItem.Content>
            <ListItem.Title>{decode(agendaEntryTitle)}</ListItem.Title>
            <ListItem.Subtitle>{decode(timeText)}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>)
    } else {
      console.log('render unknown item ' + item);
    }
  };

  if(isFetched && !isError && json.events != undefined){

    console.log("fetchEvents: "+JSON.stringify(json));
    //if (json !== undefined && json !== null && json.events !== undefined && json.events !== null){
  
      let filteredEvents = new Array(0);
      for (event of json.events){
        for (category of event.categories){
          if (category.id == eventParentId){
            filteredEvents.push(event);
          }
        }
      }
      //console.log("filteredEvents: "+ JSON.stringify(filteredEvents));
      //useState({events: filteredEvents});
      //setEvents(filteredEvents);
      //const newData = data;
      //Array.prototype.push.apply(newData, filteredEvents);
      //useState({data: newData});
      //setData(newData);
      console.log('filteredEvents = ' + filteredEvents);
    /*} else {
      setEvents([]);
    }*/
  return (
    <FlatList
    style={styles.container}
    data={filteredEvents} 
    renderItem={renderListItem.bind(filteredEvents)}
    //keyExtractor={(item, index) => ''+ index}
    //extraData={data}
  />
  )};
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});