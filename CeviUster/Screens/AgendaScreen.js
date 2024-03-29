import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { decode } from 'html-entities';
import moment from 'moment';
import GLOBALS from '../Global';

export default class AgendaScreen extends React.Component {

  state = {
    categories: [],
    events:[],
    data:[],
    currentParentId: 0,
  };

  constructor(props){
     super(props);
     console.log('AgendaScreen#constructor');
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
  }

  componentDidMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.setState({data: []});
    this.fetchCategories();
    this.fetchEvents();
  }

  fetchCategories = async () => {
    console.log('fetchCategories');
    const categoryResponse = await fetch(`${GLOBALS.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await categoryResponse.json();
    if (json !== undefined && json !== null && json.categories !== undefined && json.categories !== null){
      const filteredCategories = json.categories.filter(category => category.parent == this.state.currentParentId);
      this.setState({categories: filteredCategories});
      const newData = this.state.data;
      Array.prototype.unshift.apply(newData, filteredCategories);
      this.setState({data: newData});
      console.log('filteredCategories = ' + filteredCategories);
    } else {
      this.setState({categories: new Array(0)});
    }
  }

  fetchEvents = async () => {
    console.log('fetchEvents');
    const startDate = moment().format("YYYY-MM-DD 00:00:00");
    const eventsResponse = await fetch(`${GLOBALS.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${this.state.currentParentId}&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await eventsResponse.json();
    if (json !== undefined && json !== null && json.events !== undefined && json.events !== null){

      let filteredEvents = new Array(0);
      for (event of json.events){
        for (category of event.categories){
          if (category.id == this.state.currentParentId){
            filteredEvents.push(event);
          }
        }
      }
      console.log(filteredEvents);
      this.setState({events: filteredEvents});
      const newData = this.state.data;
      Array.prototype.push.apply(newData, filteredEvents);
      this.setState({data: newData});
      console.log('filteredEvents = ' + filteredEvents);
    } else {
      this.setState({events: new Array(0)});
    }
  }

  onCategoryPressed(item){
     console.log('onCategoryPressed: selectedItem: ' + item.id + ', ' + item.name);
     console.log('navigation: ' + this.props.navigation);
     this.props.navigation.push('Agenda', {
      parentCategory: item, 
      title: item.name
    });
  }

  onEventPressed(item){
     console.log(item);
     this.props.navigation.navigate('AgendaEntry', {selectedEvent: item});
  }
  
  renderListItem = ({ item, index, separators }) => {
    console.log('renderListItem: ' + item);
    if (typeof item.name !== 'undefined') {
      console.log('render category');
      // Handle category
      return (<TouchableOpacity>
        <ListItem 
          bottomDivider
          onPress={ () => this.onCategoryPressed(item)}>
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
          onPress={ () => this.onEventPressed(item)}>
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
  }

  render() {
    console.log('render data = ' + this.state.data);
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderListItem.bind(this)}
          keyExtractor={(item, index) => ''+ index}
          extraData={this.state}
        />
      </View>
    )
  }
}

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