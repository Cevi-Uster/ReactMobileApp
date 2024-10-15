import React from 'react';
import { router, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { decode } from 'html-entities';
import moment from 'moment';
import URLs from "../../../constants/URLs";

export default function AgendaScreen(props) {

    const param = ({
        // ID der agenda
        agendaId,
        // Name der Stufe für die Anzeige im Titel
        title,
    } = useLocalSearchParams<{ agendaId: Int ; title: string }>());

    enum states {
      init,
      rendered,
      newData,
      requestData
    }

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const [currentParentId, setCurrentParentId] = useState(param.agendaId);
  const [componentState, setComponentState] = useState(states.init);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    console.log("UseLayoutEffect ComponentState: "+componentState);
    if(!param.title){
        navigation.setOptions({
            title: "Agenda",
        });
    }else{
      navigation.setOptions({
          title: param.title,
      });
    }
  }, [navigation]);

  useEffect(() => {
      console.log("ComponentState: "+componentState);

      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        setComponentState(states.requestData);
      });

      fetchData();

      return unsubscribe;
  }, [componentState]);

  //fetchData();

  /*constructor(props){
     super(props);
     console.log('AgendaScreen#constructor');
     console.log(props);
     if (this.props.route.params && this.props.route.params.parentCategory){
       let parentCategory = this.props.route.params.parentCategory;
       console.log('parentCategory=' + parentCategory);
       this.state.currentParentId = parentCategory.id;
       this.props.navigation.setOptions({ title: parentCategory.name });
     } else {
       this.props.navigation.setOptions({ title: "Agenda" });
     }
     console.log('currentParentId=' + this.state.currentParentId);
     this.onCategoryPressed = this.onCategoryPressed.bind(this);
     this.onEventPressed = this.onEventPressed.bind(this);
  }*/

  function fetchData(){

    console.log("currentParentId: "+currentParentId);
    if(componentState === states.requestData){
      setData([]);
      fetchCategories();
    }
    //fetchEvents();
    if(componentState === states.init){ 
      if(currentParentId == undefined){
        setCurrentParentId(0);
      }
      setComponentState(states.requestData);
    }
    if(componentState === states.newData){
      setComponentState(states.rendered);
    }
  }

  async function fetchCategories() {
    console.log('fetchCategories');
    const categoryResponse = await fetch(`${URLs.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await categoryResponse.json();
    console.log("categorie Id: "+ currentParentId );
    //console.log(json.categories);
    if (json !== undefined && json !== null && json.categories !== undefined && json.categories !== null){
      const filteredCategories = json.categories.filter(category => category.parent == currentParentId);
      console.log(filteredCategories);
      setCategories(filteredCategories);
      const newData = data;
      Array.prototype.unshift.apply(newData, filteredCategories);
      setData(newData);
      console.log('filteredCategories = ' + filteredCategories);
      setComponentState(states.newData);
    } else {
      setCategories(new Array(0));
    }
  }

  async function fetchEvents(){
    console.log('fetchEvents');
    const startDate = moment().format("YYYY-MM-DD 00:00:00");
    const eventsResponse = await fetch(`${URLs.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${this.state.currentParentId}&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await eventsResponse.json();
    if (json !== undefined && json !== null && json.events !== undefined && json.events !== null){

      let filteredEvents = new Array(0);
      for (event of json.events){
        for (category of event.categories){
          if (category.id == currentParentId){
            filteredEvents.push(event);
          }
        }
      }
      console.log(filteredEvents);
      useState({events: filteredEvents});
      const newData = data;
      Array.prototype.push.apply(newData, filteredEvents);
      useState({data: newData});
      console.log('filteredEvents = ' + filteredEvents);
    } else {
      useState({events: new Array(0)});
    }
  }

  function onCategoryPressed(item){
     console.log('onCategoryPressed: selectedItem: ' + item.id + ', ' + item.name);
     console.log('navigation: ' + navigation);
     /*this.props.navigation.push('Agenda', {
      parentCategory: item, 
      title: item.name
    });*/
    setData([]);
    router.push('/agenda/agendaCategories?agendaId=' + item.id + '&title=' + item.name);
    //setCurrentParentId(item.id);
    //setComponentState(states.requestData);
  }

  function onEventPressed(item){
     console.log(item);
     //this.props.navigation.navigate('AgendaEntry', {selectedEvent: item});
     router.push('/agenda/agendaEntry?selectedEvent=' + item);
  }
  
  //function renderListItem (item){
  renderListItem = ({ item, index, separators }) => {
    console.log('renderListItem: ' + JSON.stringify(item));
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
    } else if (typeof item.title !== 'undefined') {
      console.log('render event');
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


    if(componentState === states.rendered){
    console.log('render data = ' + JSON.stringify(data));

    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderListItem.bind(data)}
          //keyExtractor={(item, index) => ''+ index}
          //extraData={data}
        />
      </View>
    )
  }
} // end of function component

const styles = StyleSheet.create({
  container: {
    flex: 1,
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